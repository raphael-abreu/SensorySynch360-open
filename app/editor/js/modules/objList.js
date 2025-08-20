/* eslint-disable max-classes-per-file */
import translator from '../translation.js';

class ObjList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.items = [];
    this.events = {};
    this.renderList();
  }

  addElement(name, data) {
    const newItem = {
      name,
      data,
      id: Date.now(),
    };
    this.items.unshift(newItem);
    this.renderList();
  }

  clearAll() {
    this.items = [];
    this.renderList();
  }

  deleteItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.renderList();
  }

  updateItemName(id, newName) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.name = newName;
      this.renderList();
    }
  }

  findItemByData(data) {
    const item = this.items.find((item) => item.data === data);
    if (item) {
      return item;
    }
    return null;
  }

  addEventListener(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  trigger(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback.apply(this, args);
      });
    }
  }
}

export class InfospostList extends ObjList {
  constructor(containerId, timelineObj) {
    super(containerId);
    this.timelineObj = timelineObj;
    this.renderList();
  }

  addElement(data) {
    const newItem = {
      data,
      id: Date.now(),
      isActive: false,
    };
    this.items.unshift(newItem);
    this.renderList();
  }

  renderList() {
    this.container.innerHTML = '';
    function compare(a, b) {
      const aN = Number(Object.keys(a.data.getObjectByName('properties').userData.keyframes)[0]);
      const bN = Number(Object.keys(b.data.getObjectByName('properties').userData.keyframes)[0]);
      if (aN < bN) {
        return -1;
      }
      return 0;
    }
    const orderedItems = this.items.sort(compare);
    orderedItems.forEach((item) => {
      const listItem = document.createElement('li');
      if (item.isActive) {
        listItem.className = 'list-none rounded-sm p-2 flex cursor-pointer btn-primary';
      } else {
        listItem.className = 'list-none rounded-sm p-2 flex cursor-pointer hover:bg-blue-700';
      }
      listItem.style.borderBottomWidth = '0';
      if (item.customName) {
        listItem.textContent = item.customName;
      } else {
        const properties = item.data.getObjectByName('properties').userData;
        listItem.textContent = translator.translateForKey(`effect.${properties.effectType.toLowerCase()}`, translator.currentLanguage);
        if (typeof this.timelineObj !== 'undefined') {
          const keyframes = {};

          for (const key in properties.keyframes) {
            keyframes[key] = properties.keyframes[key];
          }

          const keyframeKeys = Object.keys(keyframes);
          const start = Number(keyframeKeys[0]);
          const end = Number(keyframeKeys[keyframeKeys.length - 1]);
          listItem.style.position = 'relative';
         
          if(properties.opts && Object.values(properties.opts)[0])
            listItem.textContent += ` (${Object.values(properties.opts)[0]})`;// ,${this.formatTime(end)}] `;

          if(properties.isAmbient == true)
            listItem.textContent += ` -a`;
          
          const maxDuration = window.videoDuration; // Get the maximum duration from the window object

          // Calculate the percentage of the video duration for start and end
          const startPercentage = (start / maxDuration) * 100;
          const endPercentage = (end / maxDuration) * 100;
        
          // Create a new div element to serve as the yellow bar
          const yellowBar = document.createElement('div');
          yellowBar.style.position = 'absolute';
          yellowBar.style.display = 'block';
          yellowBar.style.bottom = '0'; // Position at the bottom of the parent div
          yellowBar.style.left = `${startPercentage}%`; // Set the starting point based on the start value
          yellowBar.style.width = `${endPercentage - startPercentage}%`; // Set the width based on the start and end values
          yellowBar.style.height = '2px'; // Set the height of the yellow bar
          yellowBar.style.backgroundColor = 'yellow'; // Set the color of the bar
        
          // Append the yellow bar to the listItem (assuming listItem is the parent div)
          listItem.appendChild(yellowBar);

        }
      }
     
      /*
      const editButton = document.createElement('button');
      editButton.className = 'edit-button flex ml-auto';
      
      editButton.textContent = '🖊️';
      editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const newName = prompt('Enter a new name for the list item:');
        if (newName) {
          this.updateItemName(item.id, newName);
        }
      });
      
      listItem.appendChild(editButton); */

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '❌';
      deleteButton.className = 'delete-button flex ml-auto';
      deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteInfo(item.data); // from window.deleteinfo
      });

      listItem.appendChild(deleteButton);

      this.container.appendChild(listItem);

      listItem.addEventListener('click', () => {
        // Trigger custom event with associated data
        this.trigger('itemClick', item.data);
      });
    });
  }

  addEventListener(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  trigger(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback.apply(this, args);
      });
    }
  }

  formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
    //
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  updateItemName(id, newName) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.customName = newName;
      this.renderList();
    }
  }

  clearActiveItems() {
    // make all inactive
    this.items.forEach((item) => {
      if (item.isActive) { item.isActive = false; }
    });
    this.renderList();
  }

  setItemActiveByData(data) {
    // make all inactive

    this.items.forEach((item) => {
      if (item.isActive) { item.isActive = false; }
    });

    // set this current to true
    const item = this.findItemByData(data);
    item.isActive = true;
    this.renderList();
  }
}
