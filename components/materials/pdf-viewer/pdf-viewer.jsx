import React, { useState } from 'react';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { CircularProgress } from '../circular.jsx';
import { __ } from '../../utilities/helpers.jsx';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export function PDFViewer({src}) {
	const [state, setState] = useState({
		error: false,
		loaded: false
	});

	const defaultLayoutPluginInstance = defaultLayoutPlugin();
  	return <div style={(state.error || !state.loaded) ? {} : {border: '1px solid rgba(0, 0, 0, 0.3)', height: '750px'}}>
		<Worker workerUrl={`${window.CrewHRM.dist_url}libraries/pdf.worker.js`}>
			<Viewer 
				fileUrl={src} 
				plugins={[defaultLayoutPluginInstance]}
				renderError={()=>setState({...state, error: true})}
				onDocumentLoad={()=>setState({...state, loaded: true})}
				renderLoader={percentages =><div className={'d-flex flex-flow-column row-gap-15 align-items-center justify-content-center'.classNames()}>
						<CircularProgress 
							size={100} 
							strokeWidth={5} 
							percentage={Math.round(percentages)}
							showPercent={true}
							fontSize={24}/>

						<div>
							{__( 'Loading Document' )}
						</div>
					</div>
				}/>
		</Worker>

		{state.error && <div className={'text-color-danger'.classNames()}>
			{__( 'Failed to open here.' )} <a href={src} target='_blank'>{__( 'Download Instead.' )}</a>
		</div> || null}
	</div>
};