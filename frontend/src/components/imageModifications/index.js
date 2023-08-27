import React, { useState } from 'react'

import AutoTagging from './tabs/autoTagging'
import EditPhoto from './tabs/editPhoto';
import Optimise from './tabs/optimise';
import Convert from './tabs/convert';

const ImageModifications = (props) => {
    const[tabOpened, setTabOpened] = useState(null);  // auto-tagging, edit-photo, optimise, convert

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <div className="flex flex-grow flex-row border-t-[1px] border-gray relative font-Inter">
            <div className='flex flex-row absolute left-1/2 transform -translate-x-1/2 mt-[-35px] ml-[-80px] text-[14px] font-medium'>
               <img src='/icons/directionArrow.svg' className='mr-[6px]'/>
                <div className='mr-[10px] cursor-pointer'
                    onClick={props.previousClickHandler}
                >
                    Previous
                </div>
                <div className='text-purple-dark font-semibold w-[30px] text-center'>{props.index +1}/{props.images.length}</div>
                <div className='ml-[10px] cursor-pointer'
                    onClick={props.nextClickHandler}
                >
                    Next
                </div>
                <img src='/icons/directionArrow.svg' className='ml-[6px] transform transition-transform duration-500 ease-in-out rotate-180'/>
            </div>
            <div className="flex flex-col min-w-[43%] border-r-[1px] border-gray">
                <div className="flex flex-col">
                    <AutoTagging 
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'auto-tagging'}
                        image={props.image}
                        index={props.index}
                        setSelectedImages={props.setSelectedImages}
                    />

                    <EditPhoto
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'edit-photo'}
                    />

                    <Optimise
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'optimise'}
                        image={props.image}
                        images={props.images}
                        index={props.index}
                        setSelectedImages={props.setSelectedImages}
                    />

                    <Convert
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'convert'}
                        image={props.image}
                        images={props.images}
                        index={props.index}
                        setSelectedImages={props.setSelectedImages}
                    />
                </div>
            </div>

            <div className='flex flex-col min-w-[57%] pb-[20px]'>
                {/* Image Information */}
                <div className='flex flex-row justify-between h-[138px] w-full border-b-[1px] border-gray p-[20px] text-[14px]'>
                    <div className='flex flex-col gap-y-[10px] w-[50%]'>
                        {/* col 1 */}
                        <div className='flex flex-row'>
                            <div className='w-[70px] font-medium'>Name: </div>
                            <div>{props.image.file.name.split('.')[0]}</div>
                        </div>

                        <div className='flex flex-row'>
                            <div className='w-[70px] font-medium'>Size: </div>
                            <div>{(props.image.file.size / 1024).toFixed(2)} KB</div>
                        </div>

                        <div className='flex flex-row'>
                            <div className='w-[70px] font-medium'>Format: </div>
                            <div>{props.image.file.type.split('/').pop()}</div>
                        </div>
                    </div>
                    
                    {/* col 2 */}
                    <div className='flex flex-col w-[50%]'>
                        <div className='flex flex-row'>
                            <div className='min-w-[100px] font-medium'>Last Modified: </div>
                            <div className='pl-[5px]'>{formatDate(props.image.file.lastModifiedDate)}</div>
                        </div>
                    </div>
                </div>

                {/* Image Preview */}
                <div className='flex flex-col flex-grow h-[calc(100vh-300px)] mb-[10px]'>
                    <div className='flex justify-center h-[95%] w-full p-[15px] pb-[5px] items-center object-contain'>
                        <img src={URL.createObjectURL(props.image.file)} className='max-h-full object-contain box-border'/>
                    </div>
                    <div className='flex justify-center text-[14px]'>
                        {props.image.caption}
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex flex-row mt-auto h-auto px-[20px]'>
                    <button className='flex flex-row gap-x-[15px] items-center outline-none text-[#253142] bg-[#F1F1F1] border-[1px] border-gray font-medium px-[20px] py-[10px] rounded-[5px] text-[14px] box-border'>
                        Cancel
                    </button>

                    <button className='flex flex-row gap-x-[15px] items-center outline-none text-purple-dark bg-purple-light border-[1px] border-purple-dark font-medium px-[20px] py-[10px] rounded-[5px] text-[14px] ml-auto box-border'>
                        Download
                    </button>

                    <button className='flex flex-row gap-x-[15px] items-center border-none outline-none bg-purple-dark text-white font-medium px-[20px] py-[10px] rounded-[5px] ml-[20px] text-]14px] box-border'>
                        <img src='/icons/save.svg'/>
                        save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageModifications