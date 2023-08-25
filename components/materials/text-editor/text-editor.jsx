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
		editorState: contentBlock ? EditorState.createWithContent(ContentState.createFromBlockArray(contentBlock.contentBlocks)) : EditorState.createEmpty(),
		focus: false,
	});

	const onChange=(editorState)=>{
		dispatchTo(draftToHtml(convertToRaw(editorState.getCurrentContent())));
		setState({...state, editorState});
	}

	return <Editor 
			onFocus={()=>setState({...state, focus: true})}
    		onBlur={()=>setState({...state, focus: false})}
			placeholder={placeholder}
			editorState={state.editorState}
			wrapperClassName={'wrapper'.classNames(style) + `border-radius-10 border-1 b-color-tertiary b-color-active-primary ${state.focus ? 'active' : ''}`.classNames()}
        	editorClassName={'editor'.classNames(style)}
			toolbarClassName={'toolbar'.classNames(style)}
			toolbar={{
				  options: ['inline', 'fontSize', 'list'],
			}}
			onEditorStateChange={onChange}/>
}