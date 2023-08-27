import React, { useEffect, useState } from 'react'

const AutoTagging = (props) => {
    const [open, setOpen] = useState(props.open)
    const [tags, setTags] = useState(props.image.tags)
    const [newTag, setNewTag] = useState('')

    useEffect(() => {
        setOpen(props.open)
        setTags(props.image.tags)
    }, [props])

    const onClickHanlder = () => {
        if (open) {
            props.setTabOpened(false)
        }
        else {
            props.setTabOpened("auto-tagging")
        }
    }

    const onCrossClickHandler = (indexToRemove) => {
        props.setSelectedImages(prevSelected => {
            const newSelected = [...prevSelected]
            newSelected[props.index].tags = newSelected[props.index].tags.filter((tag, index) => index !== indexToRemove)
            return newSelected
        })
    }

    const onAddTagHandler = (tag) => {
        props.setSelectedImages(prevSelected => {
            const newSelected = [...prevSelected]
            newSelected[props.index].tags = [...newSelected[props.index].tags, tag]
            return newSelected
        })
        setNewTag('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onAddTagHandler(newTag);
        }
    };

    return (
        <>
            <div
                className={`flex flex-row py-[22px] px-[35px] box-border text-[16px] border-b-[1px] border-gray cursor-pointer ${open && 'bg-[#FAFAFA] text-purple-dark font-medium'}`}
                onClick={onClickHanlder}
            >
                Auto Tagging
                <img 
                    src='/icons/arrow.svg' 
                    className={`ml-auto transform transition-transform duration-500 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`}  
                />
            </div>
            <div
                className={`flex flex-row flex-wrap gap-x-[30px] gap-y-[22px] overflow-hidden transition-height duration-800 ease-in-out box-border text-[14px] text-[#253143] items-start
                ${open ? 'h-auto py-[22px] px-[35px] border-b-[1px] border-gray' : 'h-[0]'}`}
            >

                {tags.map((tag, index) => (
                    <div key={tag} className='flex flex-row rounded-[5px] bg-purple-light px-[10px] py-[7px] font-medium box-border'>
                        {tag}
                        <img src='/icons/cross.svg' className='ml-[22px] cursor-pointer' onClick={() => onCrossClickHandler(index)}/>
                    </div>
                ))
                }

                <div className='flex flex-row rounded-[5px] bg-purple-light px-[10px] py-[7px] font-medium box-border w-auto min-w-[15px]'>
                    <input 
                        type='text' 
                        placeholder='Add tag' 
                        value={newTag} onChange={(e) => setNewTag(e.target.value)} 
                        onKeyPress={handleKeyPress}
                        className={`bg-transparent outline-none border-none w-[60px]`} />
                    <img src='/icons/plus.svg' className='ml-[22px] cursor-pointer' onClick={() => onAddTagHandler(newTag)}/>
                </div>

                <div className='flex flex-row items-center mt-[30px] gap-x-[8px] text-[10px] ml-auto box-border'>
                    <div>powered by</div>
                    <img src="/icons/meta.png" className='w-[70px]'/>
                </div>
                
            </div>
        </>
    )
}

export default AutoTagging