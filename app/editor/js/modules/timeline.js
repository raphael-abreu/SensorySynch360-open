export class Timeline {
  constructor(timelineConteiner, videoDuration) {
    this.timelineConteiner = timelineConteiner;
    this.needlePosition = 0;
    this.videoDuration = videoDuration; // in seconds!
    this.isPlaying = false;
    this.events = {};
    // in the future, add the data programatically after the return from createcontrolshtml
    this.playIcon = null;
    this.pauseIcon = null;
    // globais para mudar agulha
    this.timelineNeedle = null;
    this.timelineClickArea = null;
    // globais para trim
    this.isClick = true;
    this.dragStartX = null;
    this.dragStartKeyframe = 0;
    this.isDraggingTrim = null;
    this.trimSelector = null;
    this.leftHandleTrim = null;
    this.rightHandleTrim = null;
    this.initialLeftOffset = 0;
    this.initialRightOffset = 0;
    this.initialTrimSelectorLeft = 0;
    this.leftTooltipSpan = '';
    this.rightTooltipSpan = '';
    this.currentClickedTrim = null;
     // Globals for the keyframes
    this.keyframesBase = null;
    this.clickedKeyframeSecond = null;
    this.createControlsHTML();
    this.initStyle();
  }

  createControlsHTML() {
    const playPauseButtonHTML = this.createButtonsHTML();
    const timelineHTML = this.createTimelineHTML();
    const trimHTML = this.createTrimHTML();
    const timeMarkers = this.addTimeMarkers();
    const keyframesBase = this.createKeyframesBaseHTML();

    timelineHTML.appendChild(trimHTML);
    timelineHTML.appendChild(timeMarkers);
    timelineHTML.appendChild(keyframesBase);


    this.timelineConteiner.appendChild(playPauseButtonHTML);
    this.timelineConteiner.appendChild(timelineHTML);
  }

  addTimeMarkers() {
    const timelineSize = timelineConteiner.getBoundingClientRect().width;
    let markerInterval;
    if (this.videoDuration >= 120) {
      markerInterval = 10; 
    }else if (this.videoDuration >= 60) {
      markerInterval = 5; 
    } else if (this.videoDuration >= 30) {
      markerInterval = 2; 
    } else {
      markerInterval = 1; // Each marker represents 1 second
    }
    const numMarkers = Math.ceil(this.videoDuration / markerInterval)-1; // Round up to the nearest second

    const timeMarkersContainer = document.createElement('div');
    timeMarkersContainer.className = 'time-markers';
  
    for (let i = 0; i <= numMarkers; i++) {
      const markerTime = markerInterval * i;
      const markerPosition = (markerTime / this.videoDuration) * 100;
      const marker = document.createElement('div');
      marker.classList.add('time-marker');
      marker.style.left = `${markerPosition}%`;
  
      const markerLabel = document.createElement('div');
      markerLabel.classList.add('time-marker-label');
      markerLabel.textContent = this.formatTime(markerTime);
  
      marker.appendChild(markerLabel);
      timeMarkersContainer.appendChild(marker);
    }
  
    const lastMarker = document.createElement('div');
    lastMarker.classList.add('time-marker');
    lastMarker.style.left = '99.5%';
    timeMarkersContainer.appendChild(lastMarker);
  
    return timeMarkersContainer;
  }
  

  createTrimHTML() {
    const trimSelector = document.createElement('div');
    trimSelector.className = 'trim-selector trim-colored';
    trimSelector.id = 'trimConteiner';
    this.trimSelector = trimSelector;
    this.initialTrimSelectorLeft = trimSelector.getBoundingClientRect().left;
    const trimSizeBg = document.createElement('div');
    trimSizeBg.className = 'trim-size-bg';

    const leftHandleTrim = document.createElement('div');
    leftHandleTrim.className = 'handle';
    leftHandleTrim.id = 'left-handle-trim';
    this.leftHandleTrim = leftHandleTrim;

    const leftTooltipTrim = document.createElement('div');
    leftTooltipTrim.className = 'left-tooltip-trim';

    const leftTooltipFont = document.createElement('div');
    leftTooltipFont.className = 'tooltip-trim-font-left';

    const leftTooltipSpan = document.createElement('span');
    leftTooltipSpan.textContent = '00:00';
    leftTooltipSpan.setAttribute('data-current-trim-time', 0);
    this.leftTooltipSpan = leftTooltipSpan;

    const leftTooltipLine = document.createElement('div');
    leftTooltipLine.className = 'tooltip-line';

    leftTooltipFont.appendChild(leftTooltipSpan);
    leftTooltipTrim.appendChild(leftTooltipFont);
    leftTooltipTrim.appendChild(leftTooltipLine);
    leftHandleTrim.appendChild(leftTooltipTrim);

    const trimHandleLineLeft = document.createElement('div');
    trimHandleLineLeft.className = 'trim-handle-line';

    leftHandleTrim.appendChild(trimHandleLineLeft);

    const rightHandleTrim = document.createElement('div');
    rightHandleTrim.className = 'handle';
    rightHandleTrim.id = 'right-handle-trim';
    this.rightHandleTrim = rightHandleTrim;

    const rightTooltipTrim = document.createElement('div');
    rightTooltipTrim.className = 'right-tooltip-trim';

    const rightTooltipFont = document.createElement('div');
    rightTooltipFont.className = 'tooltip-trim-font-right';

    const rightTooltipSpan = document.createElement('span');
    rightTooltipSpan.textContent = this.formatTime(this.videoDuration);
    rightTooltipSpan.setAttribute('data-current-trim-time', this.videoDuration);

    this.rightTooltipSpan = rightTooltipSpan;

    const rightTooltipLine = document.createElement('div');
    rightTooltipLine.className = 'tooltip-line';

    rightTooltipFont.appendChild(rightTooltipSpan);
    rightTooltipTrim.appendChild(rightTooltipFont);
    rightTooltipTrim.appendChild(rightTooltipLine);
    rightHandleTrim.appendChild(rightTooltipTrim);

    const trimHandleLineRight = document.createElement('div');
    trimHandleLineRight.className = 'trim-handle-line';

    rightHandleTrim.appendChild(trimHandleLineRight);

    trimSelector.appendChild(trimSizeBg);
    trimSelector.appendChild(leftHandleTrim);
    trimSelector.appendChild(rightHandleTrim);
    // leftHandleTrim leftDrag
    // rightHandleTrim rightDrag
    // trimSelector trimConteiner

    leftHandleTrim.addEventListener('pointerdown', this.handleClickStart);
    rightHandleTrim.addEventListener('pointerdown', this.handleClickStart);

    return trimSelector;
  }



  
  createKeyframesBaseHTML() {
    const keyframesBase = document.createElement('div');
    keyframesBase.id = 'keyframes-base';
    this.keyframesBase = keyframesBase;
  
    return keyframesBase;
  }

  createKeyframeHTML(){
    const keyframeHTML = document.createElement('div');
    keyframeHTML.className = 'keyframe';
    
    return keyframeHTML;
  }
  removeKeyframe(element) {
    this.clickedKeyframeSecond = null;
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  removeKeyframeByTime(time) {
    const keyframes = document.querySelectorAll('.keyframe');
    keyframes.forEach((keyframe) => {
      const keyframeTime = Number(keyframe.getAttribute('data-keyframe-time'));
      if (keyframeTime === time) {
        this.removeKeyframe(keyframe);
      }
    });
  }
  removeKeyframesBetweenTimes(initialTime,endTime) {
    if(initialTime>endTime){
      let temp = initialTime;
      initialTime = endTime
      endTime = temp;
    }
    const keyframes = document.querySelectorAll('.keyframe');
    keyframes.forEach((keyframe) => {
      const keyframeTime = Number(keyframe.getAttribute('data-keyframe-time'));
      if (keyframeTime >= initialTime && keyframeTime <= endTime) {
        this.removeKeyframe(keyframe);
      }
    });
  }

  addKeyframe(position,time){
    const keyframeHTML = this.createKeyframeHTML();
    if(time) 
      keyframeHTML.setAttribute('data-keyframe-time', time);
    keyframeHTML.style.left = `${position}%`;
    this.clickedKeyframeSecond = null;
    this.clearClickedKeyframe();
    this.clearClickedTrim();

    keyframeHTML.addEventListener('click',()=>{
      const clickedSecond = Number(keyframeHTML.getAttribute('data-keyframe-time'));

      if(this.clickedKeyframeSecond == clickedSecond){ // this means that that keyframe was already clicked.
        this.clearClickedKeyframe(); 
        this.trigger('keyframe-unclick');
        return;
      }
      this.clearClickedKeyframe();
      this.clearClickedTrim();
      this.clickedKeyframeSecond = clickedSecond;
      keyframeHTML.classList.add('keyframe-clicked');
      this.trigger('keyframe-click', clickedSecond);
    });

    this.keyframesBase.appendChild(keyframeHTML);
  }

  
  keyframeClickByTime(time){
    this.clearClickedTrim();
    this.clearClickedKeyframe();    
    const keyframes = document.querySelectorAll('.keyframe');
    keyframes.forEach((keyframe) => {
      const keyframeTime = Number(keyframe.getAttribute('data-keyframe-time'));
      if (keyframeTime === time) {
        this.clickedKeyframeSecond = time;
        keyframe.classList.add('keyframe-clicked');
        //this.hideNeedle();
        this.trigger('keyframe-click', time);
      }
    });
  }

  clearKeyframes(){
    this.clearClickedKeyframe();
    while (this.keyframesBase.firstChild) {
      this.keyframesBase.firstChild.remove();
    }
  }
  
  setKeyframesTimes(keyframeTimesArray){
    // remove the first and last keyframes because we are treating them as the trim buttons
    keyframeTimesArray = keyframeTimesArray.slice(1, -1);
    keyframeTimesArray.forEach((el) => {
      let percenrageVideo = (el/ this.videoDuration) * 100;
      this.addKeyframe(percenrageVideo,el);
    });
  }

  clearClickedKeyframe(){
    this.clickedKeyframeSecond = null;
    const keyframes = document.querySelectorAll('.keyframe');
    keyframes.forEach((keyframe) => {
      keyframe.classList.remove('keyframe-clicked');
    });
  }

  toggleTrimDraggedClass(isSelected) {
    if (isSelected) {
      this.trimSelector.classList.add('trim-selected');
      this.leftHandleTrim.style.pointerEvents = 'none';
      this.rightHandleTrim.style.pointerEvents = 'none';
    } else {
      this.trimSelector.classList.remove('trim-selected');
      this.leftHandleTrim.style.pointerEvents = 'initial';
      this.rightHandleTrim.style.pointerEvents = 'initial';
    }
  }

  handleClickStart = (event) => {
    this.isClick = true;
    this.dragStartX = event.clientX;
    console.log('starting...');
    this.isDraggingTrim = event.target;

    // if it was not clicked
    if(this.currentClickedTrim == null){
      console.log("clicked");
      this.currentClickedTrim = event.target;
      this.currentClickedTrim.style.pointerEvents = 'none';

      this.dragStartKeyframe = this.getCurrentClickedTrimSecond();

    }else if(this.currentClickedTrim == event.target){ // if it was clicked, just unclickand set to false
      console.log("unclicked");
      this.clearClickedTrim();
      this.clickedKeyframeSecond = null;
      this.isClick = false;
      this.trigger('keyframe-unclick');
      
      return;
    }else{  // if the other element was clicked, unclick it before updating
      console.log("changing click");
      this.currentClickedTrim.classList.remove('trim-clicked');
      this.currentClickedTrim.style.pointerEvents = 'initial';
      this.currentClickedTrim = event.target;
      this.currentClickedTrim.style.pointerEvents = 'none';
      this.dragStartKeyframe = this.getCurrentClickedTrimSecond();

    }
    if (event.target === this.leftHandleTrim) {
      this.initialLeftOffset = event.clientX - this.leftHandleTrim.getBoundingClientRect().left;
    } else if (event.target === this.rightHandleTrim) {
      this.initialRightOffset = this.rightHandleTrim.getBoundingClientRect().right - event.clientX;
    } else {
      return;
    }

    this.timelineClickArea.addEventListener('mouseup', this.handleClickEnd);
    this.timelineClickArea.addEventListener('mouseleave', this.handleClickEnd);
    this.timelineClickArea.addEventListener('pointermove', this.handleDragMove);

    // Touch events (for mobile)
    this.timelineClickArea.addEventListener('touchend', this.handleClickEnd);
    this.timelineClickArea.addEventListener('touchcancel', this.handleClickEnd);
    this.timelineClickArea.addEventListener('touchmove', this.handleDragMove);

  };

  handleClickEnd = (event) => {

    this.toggleTrimDraggedClass(false);
    this.timelineClickArea.removeEventListener('mouseleave', this.handleClickEnd);
    this.timelineClickArea.removeEventListener('mouseup', this.handleClickEnd);
    this.timelineClickArea.removeEventListener('pointermove', this.handleDragMove);
    this.timelineClickArea.removeEventListener('touchend', this.handleClickEnd);
    this.timelineClickArea.removeEventListener('touchcancel', this.handleClickEnd);
    this.timelineClickArea.removeEventListener('touchmove', this.handleDragMove);
    this.clearClickedKeyframe();
    if (this.isClick) {
      console.log('click ended on ',this.currentClickedTrim);
      this.currentClickedTrim.style.pointerEvents = 'initial';
      this.currentClickedTrim.classList.add('trim-clicked');
      // WHY IS THIS MANIAC BELOW STOPPING THE EXECUTION FLOW??????? 
      const currentSecond = this.currentClickedTrim.querySelector('span').getAttribute('data-current-trim-time');
      this.clickedKeyframeSecond = currentSecond;
      this.trigger('trim-click', Number(currentSecond));
    } else {
      let endValue = this.getCurrentClickedTrimSecond();
      this.isDraggingTrim = false;
      console.log('drag ended from',this.dragStartKeyframe,"to:",endValue);      
      this.currentClickedTrim = null;
      this.clickedKeyframeSecond = null;
      this.trigger('trim-drag-end', {initialKeyframe: this.dragStartKeyframe, endKeyframe: endValue});
    }
    
    this.updateTrimEffect();
    this.isClick = false;
    this.dragStartX = null;
};

  handleDragMove = (event) => {
    // DID THE FUCKING MOUSE MOVED OR NOT? THEN IT`S NOT A CLICK! - CHATGPT
    if (this.dragStartX !== null) {
      const deltaX = event.clientX - this.dragStartX;
      if (deltaX !== 0) {
        this.isClick = false;
        //this.currentClickedTrim = null
      }

    if (this.isDraggingTrim) {
      console.log('dragging...');
      this.toggleTrimDraggedClass(true);


      if (this.isDraggingTrim == this.rightHandleTrim) {
        const startOfTimeline = this.timelineClickArea.getBoundingClientRect().left;
        const timelineWidth = this.timelineClickArea.getBoundingClientRect().width;
        const clickedPosition = event.clientX - startOfTimeline;
        let percenrageRight = (clickedPosition / timelineWidth) * 100;
        percenrageRight = this.roundToIntegerDuration(percenrageRight,this.videoDuration);
        const leftPercentage = Number(this.leftHandleTrim.querySelector('span').getAttribute('data-current-percentage'));
        console.log(percenrageRight,leftPercentage)
        if(percenrageRight < leftPercentage+5)
          return
        if(this.getTooltipContentPercentage(this.rightTooltipSpan) == percenrageRight)
          return
        this.trimSelector.style.right = `${100 - percenrageRight}%`;
        this.updateTooltipContent(this.rightTooltipSpan, percenrageRight);
        console.log('Dragging right: to', percenrageRight);
        this.trigger('trim-dragging', percenrageRight);


      } else if (this.isDraggingTrim == this.leftHandleTrim) {
        const startOfTimeline = this.timelineClickArea.getBoundingClientRect().left;
        const timelineWidth = this.timelineClickArea.getBoundingClientRect().width;
        const clickedPosition = event.clientX - startOfTimeline;
        let percentageLeft = (clickedPosition / timelineWidth) * 100;
        const rightPercentage = Number(this.rightHandleTrim.querySelector('span').getAttribute('data-current-percentage'));
        percentageLeft = this.roundToIntegerDuration(percentageLeft,this.videoDuration);

        if(percentageLeft > rightPercentage - 2)
          return
        if(this.getTooltipContentPercentage(this.leftTooltipSpan) == percentageLeft)
          return
        this.trimSelector.style.left = `${percentageLeft}%`;
        this.updateTooltipContent(this.leftTooltipSpan, percentageLeft);
        console.log('Dragging left to: ', percentageLeft);
        this.trigger('trim-dragging', percentageLeft);
      } else {
        console.log('no draggable handles were selected');
      }
    }
  }
  };


  createButtonsHTML() {
    const playPauseButton = document.createElement('button');
    playPauseButton.type = 'button';
    playPauseButton.id = 'play-pause';

    const playIcon = document.createElement('img');
    playIcon.id = 'play-icon';
    playIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIiBmaWxsPSJ3aGl0ZSI+PCEtLSBGb250IEF3ZXNvbWUgUHJvIDUuMTUuNCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSAtLT48cGF0aCBkPSJNNDI0LjQgMjE0LjdMNzIuNCA2LjZDNDMuOC0xMC4zIDAgNi4xIDAgNDcuOVY0NjRjMCAzNy41IDQwLjcgNjAuMSA3Mi40IDQxLjNsMzUyLTIwOGMzMS40LTE4LjUgMzEuNS02NC4xIDAtODIuNnoiLz48L3N2Zz4=';
    playIcon.width = '15';
    playIcon.alt = 'toggle playback icon';
    this.playIcon = playIcon;

    const pauseIcon = document.createElement('img');
    pauseIcon.id = 'pause-icon';
    pauseIcon.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTQgNGg0djEwaC00Wk0xMCA0aDR2MTBoLTRaIiBzdHlsZT0iZmlsbDogd2hpdGUiIC8+PC9zdmc+';
    pauseIcon.width = '15';
    pauseIcon.alt = 'toggle pause icon';
    this.pauseIcon = pauseIcon;

    playPauseButton.appendChild(playIcon);
    playPauseButton.appendChild(pauseIcon);

    playPauseButton.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    return playPauseButton;
  }

  createTimelineHTML() {
    const timelineBase = document.createElement('div');
    timelineBase.className = 'timeline-base';

    const timelineBg = document.createElement('div');
    timelineBg.className = 'timelineBg';

    const timelineClickArea = document.createElement('div');
    timelineClickArea.id = 'timelineClickArea';

    this.timelineClickArea = timelineClickArea;

    const timelineBgColor = document.createElement('div');
    timelineBgColor.className = 'timelineBgColor';

    const timelineNeedle = document.createElement('div');
    timelineNeedle.id = 'timelineNeedle';
    this.timelineNeedle = timelineNeedle;

    timelineBgColor.appendChild(timelineNeedle);
    timelineClickArea.appendChild(timelineBgColor);
    timelineBg.appendChild(timelineClickArea);
    timelineBase.appendChild(timelineBg);

    
    let isDragging = false;
    let dragCounter = 0;
    timelineClickArea.addEventListener('mousedown', (event) => {
      isDragging = true;
    });

    timelineClickArea.addEventListener('mousemove', (event) => {
      if (isDragging) {
        dragCounter++;
        if(dragCounter % 8 !== 0 )
          return;
        const clickPosition = event.offsetX;
        const timelineWidth = timelineClickArea.clientWidth;
        const newPlaybackTime = (clickPosition / timelineWidth) * 100;
        this.updateNeedlePositionDrag(newPlaybackTime);
      }
    });

    timelineClickArea.addEventListener('mouseup', (event) => {
      isDragging = false;
      dragCounter = 0;
    });

    timelineClickArea.addEventListener('mouseleave', (event) => {
      isDragging = false;
      dragCounter = 0;
    });


    timelineClickArea.addEventListener('click', (event) => {
      const clickPosition = event.offsetX;
      const timelineWidth = timelineClickArea.clientWidth;
      const newPlaybackTime = (clickPosition / timelineWidth) * 100;

      // if it was a double click, a
      if(event.detail == 2){
        const roundedPlaybackTime = this.roundToIntegerDuration(newPlaybackTime,this.videoDuration);
        const clickedSecond = this.roundToIntegerTreshold((this.videoDuration * roundedPlaybackTime)/100);
        this.trigger('double-click',clickedSecond,roundedPlaybackTime);
      }else{
        this.updateNeedlePositionClick(newPlaybackTime);
      }
    });
    
    return timelineBase;
  }

  setTrimValues(init = 0, end = 100){    
    if(this.currentClickedTrim){
      this.currentClickedTrim.classList.remove('trim-clicked');
      this.currentClickedTrim.style.pointerEvents = 'initial';
      this.currentClickedTrim = null;
    }

    this.trimSelector.style.right = `${end}%`;
    this.trimSelector.style.left = `${init}%`;
    this.updateTooltipContent(this.leftTooltipSpan, init);
    this.updateTooltipContent(this.rightTooltipSpan, 100-end);
  }

  formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  parseTime(timeString) {
    const [minutes, seconds] = timeString.split(':');
    return parseInt(minutes)*60 + parseInt(seconds);
  }

  roundToIntegerDuration(percentage, videoDuration) {
    const decimalPercentage = percentage / 100;
    const timeInSeconds = decimalPercentage * videoDuration;
    const roundedTimeInSeconds = Math.round(timeInSeconds);
    let roundedPercentage = (roundedTimeInSeconds / videoDuration) * 100;
    roundedPercentage = roundedPercentage;
    if(roundedPercentage >= 98) 
      return 100;
    if(roundedPercentage <= 0)
      return 0;
    return roundedPercentage;
  }
  
  roundToIntegerTreshold(number) {
    const threshold = 0.0001; // Adjust this threshold value as per your requirement
    
    if (Math.abs(number - Math.round(number)) < threshold) {
      return Math.round(number);
    } else {
      return number;
    }
  }
  
  updateTooltipContent(tooltipSpan, percentage) {
    const decimalPercentage = percentage/100;
    const time = this.formatTime(this.videoDuration * decimalPercentage);
    tooltipSpan.textContent = time;
    tooltipSpan.setAttribute('data-current-percentage',percentage);
    tooltipSpan.setAttribute('data-current-trim-time', this.roundToIntegerTreshold(this.videoDuration * decimalPercentage));
    //console.log("Curr time in tooltip span: ",time);
  }
   
  getTooltipContentPercentage(tooltipSpan) {
    return Number(tooltipSpan.getAttribute('data-current-percentage'))
  }
  
  getTooltipContentTime(tooltipSpan) {
    return Number(tooltipSpan.getAttribute('data-current-trim-time'))
  }

  setTrimTime(initialTime,endTime){
    if(!Number.isInteger(initialTime) || (!Number.isInteger(endTime) && endTime != this.videoDuration)){
      throw new Error("The time must be set in integer seconds!");
    }
      let percenrageRight = 100- (endTime/ this.videoDuration) * 100;
      let percenrageLeft = (initialTime/ this.videoDuration) * 100;

      this.trimSelector.style.right = `${percenrageRight}%`;
      this.trimSelector.style.left = `${percenrageLeft}%`;

      this.updateTooltipContent(this.rightTooltipSpan, 100 - percenrageRight);
      this.updateTooltipContent(this.leftTooltipSpan, percenrageLeft);
  }

  play() {
    if(this.isPlaying)
      return;
    this.isPlaying = true;
    this.trigger('play');
    this.showNeedle();
    this.clearClickedTrim();
    this.clearClickedKeyframe();

    const needleTooltipSpan = document.createElement('span');
    needleTooltipSpan.textContent = '00:00';
    needleTooltipSpan.setAttribute('data-current-trim-time', 0);
    this.timelineNeedle.appendChild(needleTooltipSpan);

    this.playIcon.style.display = 'none';
    this.pauseIcon.style.display = 'block';
  }

  pause() {
    this.isPlaying = false;
    this.trigger('pause');
    const spanToRemove = this.timelineNeedle.querySelector('span');
    this.timelineNeedle.removeChild(spanToRemove);

    this.pauseIcon.style.display = 'none';
    this.playIcon.style.display = 'block';
  }

  updateNeedlePositionDrag(position) {
    this.needlePosition = position;
    this.timelineNeedle.style.left = `${position}%`;
    this.trigger('needlePositionChangedDrag', position/100);
    this.clickedKeyframeSecond = null;
    this.showNeedle();
    this.clearClickedTrim();
    this.clearClickedKeyframe();
  }

  updateNeedlePositionClick(position) {
    this.needlePosition = position;
    this.timelineNeedle.style.left = `${position}%`;
    this.trigger('needlePositionChangedClick', position/100);
    this.clickedKeyframeSecond = null;
    this.showNeedle();
    this.clearClickedTrim();
    this.clearClickedKeyframe();
  }



  updateNeedlePosition(decimalPosition) {
    const positionPercent = decimalPosition * 100;
    this.needlePosition = positionPercent;
    this.timelineNeedle.style.left = `${positionPercent}%`;
    const spanToUpdate = this.timelineNeedle.querySelector('span');
    this.trigger('needlePositionChanged', decimalPosition);
    if(spanToUpdate)
      this.updateTooltipContent(spanToUpdate, positionPercent);
  }

  updateNeedlePositionToKeyframe(decimalPosition) {
    const positionPercent = decimalPosition * 100;
    this.needlePosition = positionPercent;
    this.timelineNeedle.style.left = `${positionPercent}%`;
    const spanToUpdate = this.timelineNeedle.querySelector('span');
    this.trigger('needlePositionChangedClick', decimalPosition);
    //this.hideNeedle();
    if(spanToUpdate)
      this.updateTooltipContent(spanToUpdate, positionPercent);
  }


  hideNeedle(){
    this.timelineNeedle.style.display = 'none'
  }
  showNeedle(){
    this.timelineNeedle.style.display = 'block'
  }

  updateTrimValues(init, end) {
    const duration = this.videoDuration;
    const initPercentage = (init / duration)*100;
    const endPercentage = (end / duration)*100;
    
    this.setTrimValues(initPercentage, endPercentage);
  };

  hideTrimBar() {
    this.trimSelector.style.display = 'none'
  };

  showTrimBar() {
    this.trimSelector.style.display = 'block'
  };

  
  getNeedlePosition(){
    return this.needlePosition/100;
  }
  updateTrimEffect() {
    this.trigger('trimChanged', this.trimColor);
  }

  getCurrentClickedSecond(){
    if(this.clickedKeyframeSecond == null){
      throw new Error("You must click on a keyframe or trim button first");
    }
    return this.clickedKeyframeSecond;
  }
  getCurrentClickedTrimSecond(){
 
    if(this.currentClickedTrim == null){
      throw new Error("You must click on a trim button first");
    }
    const currentSecond = this.currentClickedTrim.querySelector('span').getAttribute('data-current-trim-time');
    return Number(currentSecond);
  }
  getClickedTrim(){
    return this.currentClickedTrim;
  }
  clearClickedTrim() {
    if (this.currentClickedTrim) {
      this.currentClickedTrim.classList.remove('trim-clicked');
      this.currentClickedTrim.style.pointerEvents = 'initial';
      this.currentClickedTrim = null;
    }
  }

  clickOnTrim(clickedTrim){
    this.clearClickedTrim();
    if(clickedTrim != this.leftHandleTrim && clickedTrim != this.rightHandleTrim )
      throw new Error("You must only click on trim buttons");
    
    this.currentClickedTrim = clickedTrim;
    console.log('click ended on ',clickedTrim);
    clickedTrim.style.pointerEvents = 'initial';
    clickedTrim.classList.add('trim-clicked');
    const currentSecond = clickedTrim.querySelector('span').getAttribute('data-current-trim-time');
    this.clickedKeyframeSecond = currentSecond;
    this.trigger('trim-click', Number(currentSecond));
  }

  clickOnKeyframe(clickedKeyframe){
    this.clearClickedTrim();
    this.clearClickedKeyframe();    
    clickedTrim.style.pointerEvents = 'initial';
    clickedTrim.classList.add('trim-clicked');
    const currentSecond = clickedTrim.querySelector('span').getAttribute('data-current-trim-time');
    this.clickedKeyframeSecond = currentSecond;
    this.trigger('trim-click', Number(currentSecond));
  }
  
  

  clear(){
    this.clearKeyframes();
    this.clearClickedTrim();
    this.clearClickedKeyframe();
    this.hideTrimBar();
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

  initStyle() {
    const cssRules = `
        .timelineControls {
            display: flex;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            place-items: center;
          }



          #play-pause {
            cursor: pointer;
            font-size: 1em;
            margin: 0;
            border: none;
            padding: 0;
            height: 50px;
            width: 50px;
            background: #222;
            margin-right: 3px;
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-align-items: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
          }

          .timeline-base {
            width: 100%;
            height: 50px;
            background: #222;
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;

            border-radius: 0.5rem;

            touch-action: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            position: relative;
            border-radius: 0.5rem;
          }

          .timelineBg {
            width: 100%;
            height: 100%;
            /* i would love to add padding, however it breaks the trim algorithm. Fix later?*/
            /*padding: 6px 11px;*/
          }
          #keyframes-base{
            top: 0;
            height: 100%;
            position: absolute;
            width: 100%;
            display: block;
            pointer-events:none;
          }
          .keyframe{
            display: inline-block;
            top: 40%;
            position: absolute;
            width: 10px;
            margin-left: -3px;
            height: 10px;
            background: linear-gradient(to right, rgb(140, 140, 80) 50%, rgb(100, 100, 80) 50%);
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
            transform: rotate(45deg);
            pointer-events: initial;
            cursor: pointer;
          }
          .keyframe.keyframe-clicked{
            background: linear-gradient(to right, yellow 50%, rgb(255, 205, 2) 50%);
          }
          .trim-selector {
            top: 0;
            height: 100%;
            border-radius: 0.5rem;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            position: absolute;
            pointer-events: none;
          }

          .trim-selector.trim-colored {
            border-color: rgb(140, 140, 80);
          }

          .trim-selector.trim-selected {
            border-color: rgb(255, 205, 2);
          }
   
          #timelineClickArea {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .trim-size-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: transparent;
          }

          #left-handle-trim {
            pointer-events: initial;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 27px;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-align-items: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            cursor: w-resize;
          }

          #right-handle-trim {
            pointer-events: initial;
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 27px;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-align-items: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            cursor: w-resize;
          }

          .left-tooltip-trim {
            position: absolute;
            bottom: calc(100% + 14px);
            left: 15px;
            color: white;
            flex-direction: column;
            align-items: flex-end;
            display: none;

          }

          .right-tooltip-trim {
            position: absolute;
            bottom: calc(100% + 14px);
            right: 15px;
            color: white;
            flex-direction: column;
            align-items: flex-end;
            display: none;
          }

          .timelineBgColor {
            width: 100%;
            height: 100%;
            background-color: #444;
            border-radius: 11px;
            transform: scaleY(0.85) scaleX(0.98);
          }

          .trim-handle-line {
            pointer-events: none;
            height: 20px;
            border-radius: 32px;
            width: 3px;
            background: currentColor;
          }

          .tooltip-trim-font-left {
            -webkit-transform: translateX(calc(-50% + 1px));
            -moz-transform: translateX(calc(-50% + 1px));
            -ms-transform: translateX(calc(-50% + 1px));
            transform: translateX(calc(-50% + 1px));
          }

          .tooltip-line {
            width: 1px;
            height: 2rem;
            background: white;
          }

          .tooltip-trim-font-right {
            -webkit-transform: translateX(calc(50% - 1px));
            -moz-transform: translateX(calc(50% - 10px));
            -ms-transform: translateX(calc(50% - 1px));
            transform: translateX(calc(50% - 1px));
          }


          #trimConteiner {
            width: auto;
            left: 0%;
            right: 0%;
            position:absolute;
          }

          .handle {
            background: rgba(0, 0, 0, 0.2);
            color: white;
          }

          .handle.trim-clicked{
            background: rgb(255, 205, 2)!important;
            color: white;
          }

          .trim-selector.trim-colored .handle {
            background: rgb(140, 140, 80);
          }

          .trim-selector.trim-selected .handle {
            background: rgb(255, 205, 2);
          }

          .trim-selector.trim-selected .right-tooltip-trim {
            display: flex;
          }

          .trim-selector.trim-selected .left-tooltip-trim {
            display: block;
          }

          #timelineNeedle {
            font-size: 100%;
            color: black;
            -webkit-font-smoothing: antialiased;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
              "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
              sans-serif;
            user-select: none;
            box-sizing: inherit;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            width: 5px;
            height: calc(100% + 3px);
            background: white;
            position: absolute;
            top: -1.5px;
            left: 0%;
            /* change here */
            border-radius: 50px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            z-index: 1;
            pointer-events: none;
          }

          #pause-icon {
            display: none;
          }

          .time-markers {
            position:relative;
            bottom:100%;
            pointer-events: none;
           /* margin: 0px 2.8%*/
          }
          .time-markers .time-marker {
            position: absolute;
            width: 2px;
            height: 10px;
            background-color: white;
          }

          .time-markers .time-marker-label {
            position: absolute;
            font-size: 12px;
            color: white;
          }

          .time-markers .time-marker-label:first-of-type {
            left: 5px;
          }

          .time-markers .time-marker-label:last-of-type {
            right: 0;
          }

          .time-markers .time-marker-label:not(:first-of-type):not(:last-of-type) {
            transform: translateX(-50%) translateY(20px);
          }`;

    // Create a <style> element and set its text content to the CSS rules
    const styleElement = document.createElement('style');
    styleElement.textContent = cssRules;

    // Add the <style> element to the <head> section of the HTML document
    document.head.appendChild(styleElement);
  }
}
