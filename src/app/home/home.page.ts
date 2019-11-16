import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  windowWidth: number = 10;
  display_dots: boolean = false;

  bars_number: number = 100;
  delay: number = 10;

  tab: number[] = [ 5, 9, 6, 8, 3, 7, 2, 4, 1 ];
  currentPivot: number = this.tab[0];
  secondPivot: number = this.tab[1];
  i_max: number = this.tab.length - 1;
  i_min: number = 0;

  stop: boolean = false;

  constructor() {
    this.fillTab();
  }
  
  ngAfterViewInit() {
    this.windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    })
    console.log(this.windowWidth);
  }

  sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async launch(sort) {
    console.time()
    switch(sort) {
      case 'bubble':
        await this.bubbleSort();
        break;
      case 'shaker':
        await this.shakerSort();
        break;
      case 'quick':
        await this.launchQuickSort();
        break;
      case 'merge':
        await this.launchMergeSort();
        break;
      case 'merge2':
        await this.launchMergeSort2();
        break;
      default:
        await this.bubbleSort();
    }
    console.timeEnd();
  }

  fillTab() {
    this.stopSort();
    let i, j, tmp;
    let tab: number[] = [];
    for (i = 1; i <= this.bars_number; i++)
      tab.push(i);
    for (let i = tab.length-1; i > 0; i--) {
      j = Math.floor(Math.random() * (i - 1));
      tmp = tab[j];
      tab[j] = tab[i];
      tab[i] = tmp;
    }
    this.currentPivot = tab[0];
    this.secondPivot = tab[1];
    this.i_max = tab.length;
    this.i_min = 0;
    this.tab = tab;
    console.log('new tab', tab);
  }

  //* Bubble Sort
  async bubbleSort() {
    let swap: boolean;
    do {
      swap = false;
      for (let i = 0; i < this.i_max && !this.stop; i++) {
        this.currentPivot = this.tab[i];
        this.secondPivot = this.tab[i + 1];
        if (this.tab[i] > this.tab[i + 1]) {
          await this.swap(this.tab, i, i + 1);
          swap = true;
        }
      }
      this.i_max--;
    } while (swap);
  }
  //* Bubble Sort END

  //* Shaker Sort
  async shakerSort() {
    let swap: boolean;
    let i: number;
    do {
      swap = false;
      i = 0;
      for (; i < this.i_max && !this.stop; i++) {
        this.currentPivot = this.tab[i];
        this.secondPivot = this.tab[i + 1];
        if (this.tab[i] > this.tab[i + 1]) {
          await this.swap(this.tab, i, i + 1);
          swap = true;
        }
      }
      this.i_max--;
      for (; i > this.i_min && !this.stop; i--) {
        this.currentPivot = this.tab[i];
        this.secondPivot = this.tab[i - 1];
        if (this.tab[i] < this.tab[i - 1]) {
          await this.swap(this.tab, i - 1, i);
          swap = true;
        }
      }
      this.i_min++;
    } while (swap);
  }
  //* Shaker Sort END

  //* Quick Sort
  async launchQuickSort() {
    await this.quickSort(this.tab, 0, this.tab.length - 1);
  }
  async quickSort(arr, start, end) {
    if (this.stop) return;
    if (start >= end) return;

    let index: number = await this.partition(arr, start, end);

    await Promise.all([
      this.quickSort(arr, start, index-1),
      this.quickSort(arr, index+1, end)
    ]);
  }
  async partition(arr, start, end) {
    if (this.stop) return;
    let pivotIndex: number = start;
    let pivotValue: number = arr[end];
    let i: number;

    for (i = start; i < end && !this.stop; i++) {
      this.currentPivot = this.tab[i];
      this.secondPivot = this.tab[pivotIndex];
      if (arr[i] < pivotValue) {
        await this.swap(arr, i, pivotIndex++);
      }
    }
    await this.swap(arr, pivotIndex, end);
    return pivotIndex;
  }
  //* Quick Sort END

  //* Merge Sort
  async launchMergeSort() {
    await this.mergeSort(this.tab, 0, this.tab.length-1);
  }
  async mergeSort(arr, left, right) {
    if (this.stop) return;
    if (left < right) {
      let middle: number = await Math.floor(left + (right - left)/2);

      await Promise.all([
        this.mergeSort(arr, left, middle),
        this.mergeSort(arr, middle+1, right)
      ]);
      await this.merge(arr, left, middle, right);
    }
  }
  async merge(arr, l, m, r) { 
    if (this.stop) return;
    let i, j, k;
    let n1: number  = m - l + 1;
    let n2: number  =  r - m;
    let L: number[] = Array(n1);
    let R: number[] = Array(n2);

    for (i = 0; i < n1; i++)
      L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
      R[j] = arr[m + 1+ j];

    i = j = 0;
    k = l;
    while (i < n1 && j < n2 && !this.stop) {
      await this.sleep(this.delay);
      this.currentPivot = this.tab[k];
      if (L[i] <= R[j]) {
        this.secondPivot = this.tab[i];
        arr[k++] = L[i++];
      } else {
        this.secondPivot = this.tab[j];
        arr[k++] = R[j++];
      }
    }
    while (i < n1 && !this.stop) {
      this.secondPivot = this.tab[i];
      arr[k++] = L[i++];
    }
    while (j < n2 && !this.stop) {
      this.secondPivot = this.tab[j];
      arr[k++] = R[j++];
    }
  }
  // * Merge Sort END

  // * Merge Sort2 (not actually magic just done in the background)
  async launchMergeSort2() {
    await this.mergeSort2(this.tab);
  }
  async mergeSort2(arr) {
    if (arr.length > 1) {
      let i, j, k;
      i = j = k = 0;
      let mid = Math.floor(arr.length / 2);
      let L = arr.slice(0, mid);
      let R = arr.slice(mid);

      this.mergeSort2(L);
      this.mergeSort2(R);

      while (i < L.length && j < R.length && !this.stop) {
        await this.sleep(this.delay);
        this.currentPivot = this.tab[k];
        if (L[i] < R[j]) {
          this.secondPivot = this.tab[i];
          arr[k++] = L[i++];
        } else {
          this.secondPivot = this.tab[j];
          arr[k++] = R[j++];
        }
      }
      while (i < L.length && !this.stop) {
        this.secondPivot = this.tab[i];
        arr[k++] = L[i++];
      }
      while (j < R.length && !this.stop) {
        this.secondPivot = this.tab[j];
        arr[k++] = R[j++];
      }
    }
  }
  // * Merge Sort2 END

  async swap(arr, a, b) {
    await this.sleep(this.delay);
    let tmp: number = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;
  }
  stopSort() {
    this.stop = true;
    setTimeout(() => this.stop = false, 100);
  }

  toggleDots() {
    this.display_dots = !this.display_dots;
  }
}