import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import style from './editor.module.scss';

export function TextEditor({onChange: dispatchTo, value: html, placeholder}) {
    const contentBlock = html ? htmlToDraft(html) : null;
	const [state, setState] = useState({
		editorState: contentBlock ? EditorState.createWithContent(ContentState.createFromBlockArray(contentBlock.contentBlocks)) : EditorState.createEmpty()
	});

	const onChange=(editorState)=>{
		dispatchTo(draftToHtml(convertToRaw(editorState.getCurrentContent())));
		setState({...state, editorState});
	}

	return <Editor 
			placeholder={placeholder}
			editorState={state.editorState}
			wrapperClassName={'wrapper'.classNames(style) + 'border-radius-10 border-1 border-color-tertiary border-focus-color-primary'.classNames()}
        	editorClassName={'editor'.classNames(style)}
			toolbarClassName={'toolbar'.classNames(style)}
			toolbar={{
				  options: ['inline', 'fontSize', 'list'],
			}}
			onEditorStateChange={onChange}/>
}