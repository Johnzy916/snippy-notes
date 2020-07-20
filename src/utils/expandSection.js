// derived from: https://css-tricks.com/using-css-transitions-auto-dimensions/

export const collapseSection = (el) => {
    // get the height of the element's inner content, regardless of its actual size
    const sectionHeight = el.scrollHeight;
    
    // temporarily disable all css transitions
    const elementTransition = el.style.transition;
    el.style.transition = '';
    
    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(() => {
      el.style.height = sectionHeight + 'px';
      el.style.transition = elementTransition;
      
      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(() => {
        el.style.height = 0 + 'px';
      });
    });
    
    // mark the section as "currently collapsed"
    el.setAttribute('data-collapsed', 'true');
  }
  
  export const expandSection = (el) => {
    // get the height of the element's inner content, regardless of its actual size
    const sectionHeight = el.scrollHeight;
    
    // have the element transition to the height of its inner content
    el.style.height = sectionHeight + 'px';
  
    // when the next css transition finishes (which should be the one we just triggered)
    el.addEventListener('transitionend', function transitionEvent (e) {
      // remove this event listener so it only gets triggered once
      el.removeEventListener('transitionend', transitionEvent);
      
      // remove "height" from the element's inline styles, so it can return to its initial value
      el.style.height = null;
    });
    
    // mark the section as "currently not collapsed"
    el.setAttribute('data-collapsed', 'false');
  }