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
		icon: 'microphone',
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

