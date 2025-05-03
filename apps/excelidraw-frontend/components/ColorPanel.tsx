import { Colors, lineWidths } from "../lib/types"
import { cn } from "../lib/utils"

interface ColorPanelProps {
    selectedColor:string,
    setSelectedColor: (color:string)=> void
    linewidth: lineWidths,
    setLinewidth: (value:lineWidths)=> void
}

export const ColorPanel = ({selectedColor, setSelectedColor, linewidth, setLinewidth}: ColorPanelProps)=>{

    return (
        <div className="fixed top-20 left-10 flex items-center bg-[rgb(34,35,40)] p-4  w-fit h-fit rounded-md z-10">
            <div className="space-y-4">
                <div className="flex flex-col justify-center gap-2">
                    <p className="text-sm font-sans">
                        Stroke 
                    </p>
                    <div className="flex gap-2 items-center">
                        {Colors.map((color)=>(
                            <button
                            key={color}
                            className={cn("w-6 h-6 rounded-full border-2",
                                selectedColor === color ? "border-gray-100 border-2 transform scale-100 transition-all" : "border-neutral-900"
                            )}
                            style={{backgroundColor:color}}
                            onClick={()=>{setSelectedColor(color)}}></button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <p className="text-sm font-sans">
                        Stroke width 
                    </p>
                    <div className="flex-gap-x-3 items-center cursor-pointer">
                        <p className={cn("py-1 px-2.5 bg-slate-500 rounded-sm",
                            linewidth === 1 ? "transform-scale-125 transition-all ": ""
                        )}
                        onClick={()=>setLinewidth(1)}>
                            1
                        </p>
                        <p className={cn("py-1 px-2.5 bg-slate-500 rounded-sm",
                            linewidth === 2 ? "transform-scale-125 transition-all ": ""
                        )}
                        onClick={()=>setLinewidth(2)}>
                            2
                        </p>
                        <p className={cn("py-1 px-2.5 bg-slate-500 rounded-sm",
                            linewidth === 3 ? "transform-scale-125 transition-all ": ""
                        )}
                        onClick={()=>setLinewidth(3)}>
                            3
                        </p>
                        <p className={cn("py-1 px-2.5 bg-slate-500 rounded-sm",
                            linewidth === 4 ? "transform-scale-125 transition-all ": ""
                        )}
                        onClick={()=>setLinewidth(4)}>
                            4
                        </p>
                        <p className={cn("py-1 px-2.5 bg-slate-500 rounded-sm",
                            linewidth === 5 ? "transform-scale-125 transition-all ": ""
                        )}
                        onClick={()=>setLinewidth(5)}>
                            5
                        </p>
                        <p className={cn("py-1 px-2.5 bg-slate-500 rounded-sm",
                            linewidth === 10 ? "transform-scale-125 transition-all ": ""
                        )}
                        onClick={()=>setLinewidth(10)}>
                            10
                        </p>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}