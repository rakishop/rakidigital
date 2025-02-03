import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Modal } from 'bootstrap';

interface Bookmark {
  name: string;
  url: string;
  section: 'left' | 'right';
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, NgFor, MatMenuModule, MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  searchQuery: string = '';
  selectedBookmark: Bookmark = { name: '', url: '', section: 'left' };
  leftBookmarks: Bookmark[] = [];
  rightBookmarks: Bookmark[] = [];
  newBookmark: Bookmark = { name: '', url: '', section: 'left' };
  selectedSide: 'left' | 'right' = 'left';
  originalBookmark: Bookmark | null = null;

  constructor() {
    this.loadBookmarks(); // Load bookmarks when component initializes
  }

  /** ✅ Add Bookmark and Save to Local Storage **/
  addBookmark() {
    this.newBookmark.section = this.selectedSide;
    if (this.newBookmark.name && this.newBookmark.url) {
      const targetArray = this.newBookmark.section === 'left' ? this.leftBookmarks : this.rightBookmarks;
      targetArray.push({ ...this.newBookmark });

      this.saveBookmarks(); // Save to local storage
      this.newBookmark = { name: '', url: '', section: 'left' }; // Reset fields
      this.closeModal('bookmarkModal'); // Close modal
    }
  }

  /** ✅ Remove Bookmark and Update Local Storage **/
  removeBookmark(bookmark: Bookmark, side: 'left' | 'right') {
    const targetArray = side === 'left' ? this.leftBookmarks : this.rightBookmarks;
    const index = targetArray.indexOf(bookmark);
    if (index !== -1) {
      targetArray.splice(index, 1);
      this.saveBookmarks(); // Update local storage
    }
  }

  /** ✅ Save Bookmarks to Local Storage **/
  saveBookmarks() {
    localStorage.setItem('leftBookmarks', JSON.stringify(this.leftBookmarks));
    localStorage.setItem('rightBookmarks', JSON.stringify(this.rightBookmarks));
  }

  /** ✅ Load Bookmarks from Local Storage **/
  loadBookmarks() {
    const leftData = localStorage.getItem('leftBookmarks');
    const rightData = localStorage.getItem('rightBookmarks');

    this.leftBookmarks = leftData ? JSON.parse(leftData) : [];
    this.rightBookmarks = rightData ? JSON.parse(rightData) : [];
  }

  /** ✅ Edit Bookmark **/
  editBookmark(bookmark: Bookmark) {
    this.originalBookmark = { ...bookmark };
    this.selectedBookmark = { ...bookmark };
    this.openModal('editBookmarkModal');
  }

  /** ✅ Save Edited Bookmark and Update Local Storage **/
  saveEditedBookmark() {
    const { section } = this.selectedBookmark;
    const targetArray = section === 'left' ? this.leftBookmarks : this.rightBookmarks;

    const index = targetArray.findIndex(
      (b) => b.name === this.originalBookmark?.name && b.url === this.originalBookmark?.url
    );

    if (index !== -1) {
      targetArray[index] = { ...this.selectedBookmark };
      this.saveBookmarks(); // Save changes to local storage
    }

    this.closeModal('editBookmarkModal');
  }

  /** ✅ Open Bootstrap Modal **/
  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  }

  /** ✅ Close Bootstrap Modal **/
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance.hide();
    }
  }

  /** ✅ Google Search **/
  searchGoogle(query: string) {
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  }
}
