import React from 'react';

import { __ } from 'crewhrm-materials/helpers.jsx';
import style from './careers.module.scss';

const {registerBlockType} = window.wp.blocks;
const { Fragment } = window.wp.element;

const {
	BlockControls,
	InspectorControls,
	MediaPlaceholder,
	MediaReplaceFlow,
	MediaUpload
} = wp.blockEditor;

const {
	FormToggle,
	PanelBody,
	PanelRow,
	Button,
	SelectControl,
	TextControl,
	RadioControl,
} = wp.components;

export function CareersEdit({className, setAttributes, isSelected, attributes}) {
	
	return <Fragment>
		<InspectorControls>
			<PanelBody
				title={ __( 'Careers Block Settings' ) }
			>
				<PanelRow>
					<label
						htmlFor="crew-search-field-toggle"
					>
						{ __( 'Search Field' ) }
					</label>
					<FormToggle
						id="crew-search-field-toggle"
						label={ __( 'Show search field' ) }
						checked={ attributes.search }
						onChange={()=>setAttributes({search: !attributes.search})}
					/>
				</PanelRow>
				<PanelRow>
					<label
						htmlFor="crew-header-toggle"
					>
						{ __( 'Careers Page Header' ) }
					</label>
					<FormToggle
						id="crew-header-toggle"
						label={ __( 'Show banner and tagline' ) }
						checked={ attributes.header }
						onChange={()=>setAttributes({header: !attributes.header})}
					/>
				</PanelRow>
				{
					!attributes.header ? null : <>
						<PanelRow>
							<label>
								{ __( 'Banner Image' ) }
							</label>
							<MediaUpload
								onSelect={media=>setAttributes({hero_image_url: media.url})}
								type="image"
								value={attributes.hero_image_url}
								render={({ open }) => <div>
									{
										!attributes.hero_image_url ? null :
											<img src={attributes.hero_image_url} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />
									}
									<span 
										onClick={()=>attributes.hero_image_url ? setAttributes({hero_image_url: ''}) : open()} 
										style={{cursor: 'pointer'}}
									>
										{attributes.hero_image_url ? <>+ {__('Remove Image')}</> : <>+ {__('Select Image')}</>}
									</span>
								</div>}
							/>
						</PanelRow>
						
						<PanelRow>
							<TextControl
								label={ __( 'Tagline' ) }
								value={ attributes.tagline }
								onChange={ tagline => setAttributes( { tagline } ) }
							/>
						</PanelRow>
					</>
				}
				<PanelRow>
					<label
						htmlFor="crew-sidebar-toggle"
					>
						{ __( 'Sidebar Filter' ) }
					</label>
					<FormToggle
						id="crew-sidebar-toggle"
						label={ __( 'Sidebar filter panel' ) }
						checked={ attributes.sidebar }
						onChange={()=>setAttributes({sidebar: !attributes.sidebar})}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>

		<div className={ className + ' ' + style.editor}>
			<span>
				- {__('Career Listing')} -
			</span>
		</div>
	</Fragment>
}

registerBlockType(
	'crewhrm/careers',
	{
		title: __( 'Careers' ),
		description: __( 'Job post listing' ),
		category: 'common',
		icon: <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M186.944 170.714C179.052 183.808 167.931 192.955 153.94 198.157C143.357 202.103 132.416 203.717 121.295 202.641C106.587 201.206 93.4935 195.108 82.5521 184.525C73.0456 175.019 67.1265 163.36 64.7948 149.907C61.9249 133.764 63.7186 118.159 71.252 103.81C77.7092 91.2544 87.2156 82.2861 99.5919 76.367C108.202 72.2415 117.17 70.2685 126.497 70.0891C127.753 70.0891 130.084 69.9097 130.443 68.6542C132.775 62.3763 134.389 56.4572 138.156 50.8968C138.694 50.1794 139.411 50 140.129 50.1794L156.81 56.2779C157.886 56.6366 158.245 58.0715 157.707 58.9684C154.837 63.4525 142.281 72.0621 147.662 72.6002C151.429 72.959 153.402 73.6764 155.196 74.2145C164.164 77.0844 172.056 81.5686 178.693 88.5639C184.074 94.483 187.482 101.299 187.482 109.55C187.482 122.285 179.769 131.612 167.931 133.944C149.456 137.531 133.672 127.128 127.394 107.936C125.78 102.734 124.703 97.3529 124.524 91.9719C124.524 91.4338 124.345 91.075 124.345 90.5369C120.399 90.7163 116.811 91.4338 113.224 92.8687C100.309 97.7116 91.6998 107.218 87.7537 120.85C83.4489 135.379 84.8839 149.549 92.5966 162.642C98.6951 173.046 107.484 179.862 118.964 181.835C135.824 184.705 151.07 180.579 163.267 167.306M144.972 93.4068C142.819 94.3036 146.407 104.886 149.994 109.729C152.146 112.778 155.196 114.572 158.783 114.931C162.55 115.29 165.24 113.317 165.958 109.729C166.496 106.859 165.42 104.528 163.626 102.375C160.397 98.6085 156.093 96.456 151.788 94.483C151.967 94.6624 146.586 92.6893 144.972 93.4068Z" fill="#000000"/></svg>,
		supports: {
			multiple: false,
		},
		attributes: {
			search: {
				type: 'boolean',
				default: true
			},
			header: {
				type: 'boolean',
				default: true
			},
			hero_image_url: {
				type: 'string',
				default: ''
			},
			tagline: {
				type: 'string',
				default: ''
			},
			sidebar: {
				type: 'boolean',
				default: true
			},
		},
		edit: CareersEdit,
		save: props => {
			return <div className="crewhrm-careers-block" data-attributes={JSON.stringify(props.attributes)}></div>
		},
	},
);

