import React, { useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import useSafeResizeObserver from '../hooks/useSafeResizeObserver';
const CodeEditor = ({ language, value, onChange }) => {
  const useEditRef = useRef();

  useSafeResizeObserver(useEditRef, (entries) => {
    for (let entry of entries) {
      console.log('Window resized:', entry);
    }
  });

  return (
    <div ref={useEditRef} style={{ height: '74vh' }}>
        <Editor
            height="74vh"
            language={language}
            value={value}
            onChange={onChange}
            options={{
                selectOnLineNumbers: true,
                automaticLayout: true,
            }}
        />
    </div>
  );
};

export default CodeEditor;
