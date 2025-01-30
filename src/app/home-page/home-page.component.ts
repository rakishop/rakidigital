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

  addBookmark() {
    this.newBookmark.section = this.selectedSide;
    if (this.newBookmark.name && this.newBookmark.url) {
      const targetArray = this.newBookmark.section === 'left' ? this.leftBookmarks : this.rightBookmarks;
      targetArray.push({ ...this.newBookmark });
      this.newBookmark = { name: '', url: '', section: 'left' }; // Reset fields
      this.closeModal('bookmarkModal'); // Close modal
    }
  }

  removeBookmark(bookmark: Bookmark, side: 'left' | 'right') {
    const targetArray = side === 'left' ? this.leftBookmarks : this.rightBookmarks;
    const index = targetArray.indexOf(bookmark);
    if (index !== -1) targetArray.splice(index, 1);
  }

  openModal(modalId: string) {
    debugger
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = new Modal(modalElement); // Now Modal is properly typed
      modalInstance.show();
    }
  }

  closeModal(modalId: string) {
    debugger
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement); // Ensures the instance exists
      modalInstance.hide();
    }
  }


  searchGoogle(query: string) {
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  }


  editBookmark(bookmark: Bookmark) {
    this.originalBookmark = { ...bookmark }; // Store original bookmark before editing
    this.selectedBookmark = { ...bookmark };
    this.openModal('editBookmarkModal');
  }

  saveEditedBookmark() {
    debugger
    const { section } = this.selectedBookmark;
    const targetArray = section === 'left' ? this.leftBookmarks : this.rightBookmarks;

    // Find index using original bookmark data
    const index = targetArray.findIndex(
      (b) => b.name === this.originalBookmark?.name && b.url === this.originalBookmark?.url
    );

    if (index !== -1) {
      targetArray[index] = { ...this.selectedBookmark };
    }

    this.closeModal('editBookmarkModal');
  }

}
