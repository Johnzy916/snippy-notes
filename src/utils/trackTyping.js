import { checkShortcuts } from './checkShortcuts';

export let typeArray = [];  // what's typed
export let typingTimer;      // time between keypresses
export let typingTimeout = 750;      // Delay before array cleared

export const keyUpHandler = (e) => {

   var key = e.key; // key pressed

   // When user types backspace, pop character off array
   if (key === 'Backspace') {
     // Clear timer and restart
     clearTypingTimer();
     typingTimer = setTimeout(clearTypeArray, typingTimeout);

     // Remove last character typed
     typeArray.pop();
   }

   // If user uses tab or return, clear and get out
   if (key === 'Tab' || key === 'Enter' || key === ' ') {
     return clearTypeArray();
   }

  // Clear timer if still running, and start it again
  clearTypingTimer();
  typingTimer = setTimeout(clearTypeArray, typingTimeout);

  // If key is printable, add new character to typing array
  if (key.length === 1) {
    typeArray.push(key)

    // Check typed text for shortcuts
    checkShortcuts(typeArray.join(''), key, e.target);
  }
}

// Clears the typing timer
export const clearTypingTimer = () => {
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
}

// Clears the typing array
export const clearTypeArray = (e) => {
  clearTypingTimer();
  typeArray.length = [];
}

 