// sliderModule.js

class sliderAutoTip {
    constructor(tip) {
      this.tip = tip;
      this.isDragging = false;
      this.tip.style.zIndex = "9999";
      this.handleInputMouseDown = this.handleInputMouseDown.bind(this);
      this.handleInputMouseMove = this.handleInputMouseMove.bind(this);
      this.handleInputMouseUp = this.handleInputMouseUp.bind(this);
      }
  
    isRangeSlider(element) {
      return element.tagName === 'INPUT' && element.type === 'range';
    }
  
    handleInputMouseDown(event) {
      var targetElement = event.target;
  
      if (this.isRangeSlider(targetElement)) {
        document.addEventListener('mousemove', this.handleInputMouseMove);
        document.addEventListener('mouseup', this.handleInputMouseUp);
        this.isDragging = true;
      }
    }
  
    handleInputMouseMove(event) {
      if (this.isDragging) {
        var targetElement = event.target;
  
        if (this.isRangeSlider(targetElement)) {
          // Get the value of the range slider during dragging
          var sliderValue = targetElement.value;
          console.log('Slider value during drag:', sliderValue);
  
          this.tip.classList.remove('hidden');
          this.tip.setAttribute('data-tip', sliderValue);
          this.tip.style.left =
            targetElement.getBoundingClientRect().x +
            (Number(sliderValue) * targetElement.offsetWidth) /
              Number(targetElement.max) +
            'px';
          this.tip.style.top = targetElement.getBoundingClientRect().y - 10 + 'px';
        }
      }
    }
  
    handleInputMouseUp() {
      if (this.isDragging) {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleInputMouseMove);
        this.tip.classList.add('hidden');
        document.removeEventListener('mouseup', this.handleInputMouseUp);
      }
    }
  
    init() {
      document.addEventListener('mousedown', this.handleInputMouseDown);
    }
  }
  
  export default sliderAutoTip;
  