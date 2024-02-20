
export default function SVGimgComponent({svgString}) {
    return(
        <div dangerouslySetInnerHTML={{__html: svgString}}></div>
    )
}