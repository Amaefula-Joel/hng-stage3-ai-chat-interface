import { useState, useRef } from "react";

import Chat from "./Chat";
import ErrorAlert from "./ErrorAlert";

function ChatInterface() {
    const [outputs, setOutputs] = useState(['Output goes here... ']);
    const [error, setError] = useState("");
    const inputElement = useRef();


    const handleOutput = () => {
        const inputText = inputElement.current;
        if (inputText.value === "") {
            setError("Field cannot be empty");
        } else{
            setOutputs((previousState) => [...previousState, inputText.value]);
    
            inputText.value = '';
            inputText.focus();
        }
        
        // Scroll to bottom after new message
        // if (chatOutputRef.current) {
            
        //     chatOutputRef.current.scrollTop = chatOutputRef.current.scrollHeight;
        //     console.log(chatOutputRef.current.scrollTop);
        // }
    }


    
    return (
        // container body of the interface
        <div className=" bg-gray-100 pt-3 pb-5 px-2 flex justify-center">
            {/* for errors */}
            {error && <ErrorAlert error={error} onClose={() => setError("")}/>}
                
            {/* to test errors */}
            {/* <button onClick={ () => {setError('dhab fdiahbf aodfb ')}} className="px-4 py-2 bg-black text-[13px] text-white rounded-lg cursor-pointer">Summarize</button> */}

            {/* interface starts */}
            <div className="max-w-2xl w-full rounded-2xl bg-gray-200 shadow-lg shadow-gray-400 grid grid-cols-1 grid-rows-[auto_400px_auto]">

                {/* chat header */}
                <div className="chat-header text-center rounded-t-2xl bg-black text-white px-4 py-5 flex justify-between">
                    <h2 className="text-xl italic">Ai text interface</h2>
                </div>

                {/* chat output */}
                <div 
                    className="chat-output px-3 pb-5 border-b-[1px] overflow-y-auto"
                >


                    {outputs.map((output, index) => <Chat key={index} output={output} />)}

                </div>

                <div className="flex items-end gap-3 p-2">
                    <textarea name="input" ref={inputElement} className="grow-1 resize-none whitespace-normal border-2 border-gray-400 bg-gray-100 rounded-lg h-32 px-3 py-1 text-nowrap">

                    </textarea>

                    <button
                        onClick={handleOutput}
                        
                        className="grow-0 bg-black text-white h-11 w-11 cursor-pointer rounded-lg"><i className="fa fa-send"></i></button>
                </div>
            </div>

            {/* <div className="chat-output p-3 pb-7 border-2 overflow-x-auto scrollbar "></div> */}
        </div>
    )
}

export default ChatInterface;
