import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import DOMPurify from 'dompurify'
import { updateNote } from '../actions/temp'
import { keyUpHandler } from '../utils/trackTyping'
import { copyText, pasteText } from '../utils/clipboard'

export const Notes = ({update, note}) => {

      // refs
      const inputRef = useRef()
      const tooltipRef = useRef()

      // save and insert note on mount or unmount
      useEffect(() => {
            inputRef.current.innerHTML = DOMPurify.sanitize(note) || ''
            return () => {
                  update(DOMPurify.sanitize(inputRef.current.innerHTML))
            }
      }, [])

      return (
            <div className='input-container'>
            <div className="input-div"
                  contentEditable
                  ref={inputRef}
                  onKeyUp={(e) => {
                        e.preventDefault()
                        keyUpHandler(e)
                  }}
                  onPaste={(e) => {
                        e.preventDefault()
                        pasteText(e)
                  }}
                  onCopy={async (e) => {
                        e.preventDefault()
                        if (navigator.clipboard) {
                              copyText(e, tooltipRef)
                        }
                  }}>
            </div>
            {
                  navigator.clipboard &&
                  <div className='input-div__copy-container tooltip'>
                  <span className="tooltiptext" ref={tooltipRef}>Copied</span>
                  <div onClick={(e) => copyText(e, tooltipRef)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>
                  </div>
                  </div>
            }
            </div>
      );
};

const mapStateToProps = (state) => ({
      note: state.temp.note,
});

const mapDispatchToProps = (dispatch) => ({
      update: note => dispatch(updateNote(note))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notes);