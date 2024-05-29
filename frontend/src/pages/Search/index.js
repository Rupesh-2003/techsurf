import React, { useState } from 'react'
import { ScaleLoader } from "react-spinners"

const Search = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [images, setImages] = useState(null);

    const searchImages = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "query": searchQuery
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:5001/searchImage", requestOptions)
        .then(response => response.json())
        .then(result => {
            setImages(result);
            setSearching(false);
        })
        .catch(error => console.log('error', error));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setImages(null);
            setSearching(true);
            searchImages();
        }
    };

    return (
        <div className="flex flex-col flex-grow p-[30px] overflow-scroll">
            <input 
                className="w-full h-[60px] outline-none border-[1px] border-gray rounded-[5px] px-[20px]" 
                placeholder="Enter what image you want?"
                onKeyPress={handleKeyPress}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searching && 
            <div className='flex flex-col gap-y-[10px] items-center justify-center m-auto text-[14px] text-[#606060]'>
                <ScaleLoader color='#7C3AED' radius={2} margin={2} />
                Hold on, we are searching for your images
            </div>}

            
            {images !== null && images.length == 0 && 
            <div className='flex flex-col gap-y-[10px] items-center justify-center m-auto text-[14px] text-[#606060]'>
                No images found
            </div>}

            {images !== null && images.length > 0 &&
                <div className="flex flex-col flex-grow w-full overflow-scroll gap-y-[20px] mt-[30px]">
                    <div className="font-medium">Files</div>
                    <div className="flex flex-row flex-wrap gap-x-[25px] overflow-scroll gap-y-[25px] cursor-pointer">
                        {images?.map((image, index) => (
                            <div className="flex flex-col gap-y-[10px] p-[8px] bg-[#F3F6FB] w-[300px] h-[250px] box-border pt-[15px] rounded-[5px] text-[14px]">
                                <div className="flex flex-row gap-[15px] items-center ">
                                    <img src="/icons/image.svg" alt="image" className="w-[15px] h-[15px] ml-[10px]"/>
                                    {image.name}
                                </div>
                                <a href={`https://drive.google.com/uc?id=${image.file_id}`} target="_blank" rel="noopener noreferrer" className="w-full h-full object-cover">
                                    <img src={`https://lh3.googleusercontent.com/d/${image.file_id}`} className="w-full h-full object-cover" alt="file" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            }


        </div>
    )
}

export default Search