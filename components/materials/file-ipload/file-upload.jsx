import React, { useRef, useState } from "react";

import style from './upload.module.scss';
import { __, getRandomString } from "../../utilities/helpers.jsx";

export function FileUpload(props) {
	const {
		fileCount         = 4,
		textPrimary       = __( 'Browse' ), 
		textSecondary     = __( 'or, Just drop it here' ),
		value: stateFiles = [],
		onChange
	} = props;

	const input_ref = useRef();

	const [state, setState] = useState({
		highlight: false,
	});

	const handleFiles =(e, change=false)=> {

		let {files=[]} = change ? e.currentTarget : e.dataTransfer;
		let _files = [];

		for (const file of files) {
			_files.push({
				id: getRandomString(),
				file
			});
		}

		// To Do: Validate files

		onChange([..._files, ...stateFiles].slice(0, fileCount));

		// If drop
		if (!change) {
			setActionState(e, false);
		} else {
			input_ref.current.value = '';
		}
	}

	const removeFile=(e, id)=>{
		e.stopPropagation();
		
		const _files = stateFiles;
		const index = stateFiles.findIndex(f=>f.id===id);
		_files.splice(index, 1);
		onChange(_files);
	}

	const setActionState=(e, highlight) => {
		e.preventDefault();
		setState({
			...state,
			highlight
		});
	}

	return <div className={'upload'.classNames(style)}>
		<div className={`drop-container ${state.highlight ? 'highlight' : ''}`.classNames(style)}
			onDragOver={e=>setActionState(e, true)} 
			onDragLeave={e=>setActionState(e, false)}
			onDrop={e=>handleFiles(e)}
			onClick={()=>input_ref.current.click()}
			>
			<div className={'margin-bottom-5'.classNames()}>
				<i className={'ch-icon ch-icon-folder-add font-size-24 text-color-primary'.classNames()}></i>
			</div>

			<span className={'d-block font-size-15 font-weight-600 line-height-20 text-color-primary'.classNames()}>
				{textPrimary}
			</span>
			<span className={'font-size-15 font-weight-400 line-height-20 text-color-primary'.classNames()}>
				{textSecondary}
			</span>

			{stateFiles.map(({id, file})=>{
				return <div key={id} className={'d-flex align-items-center column-gap-14 margin-auto'.classNames()} style={{maxWidth: '552px'}}>
					<i className={'ch-icon ch-icon-trash cursor-pointer'.classNames()} onClick={e=>removeFile(e, id)}></i>
					<span>
						{file.name}
					</span>
				</div>
			})}
		</div>
		<input 
			ref={input_ref} 
			type="file" 
			multiple={fileCount>1}
			className={'d-none'.classNames()} 
			onChange={e=>handleFiles(e, true)}/>
	</div>
}