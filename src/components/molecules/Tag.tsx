import { v4 as uuid } from 'uuid';

/**
 * TagProps
 * @property color: Optional color to use for backgroun
 * @property children: Standard react component children to place within component
 * @property classOverride: specific set of classes to style the component with. If not defined style will use default
 */
export interface TagProps {
  color?: string;
  children: any;
  classOverride?: string;
}
/** Tag
 *  @property TagProps
  */
function Tag(props: TagProps): JSX.Element {
  // Since colors can approach white we need to determine how 'bright' a color is,
  // this can be done by calculating the luminance of the incoming color
  let  backgroundColorVal = '';
  let textColor = '';
  if (props.color) {
    const redComponent = parseInt(props.color.substring(0,2), 16);
    const greenComponent = parseInt(props.color.substring(2,4), 16);
    const blueComponent = parseInt(props.color.substring(4,7), 16);
    backgroundColorVal = `rgb(${redComponent},${greenComponent},${blueComponent})`;
    // for RGB luminance is a normalized value from 0-1 being (white->black)
    const luminance =  1 - ((redComponent*0.299) + (greenComponent*0.587) + (blueComponent*0.114)) / 255;
    // for colors bellow the half point we'll use a white text, for values over half point we'll use black
    if (luminance > 0.5) {
      textColor = 'text-white';
    }
  }
  return(
    <div
      key={uuid()}
      className={
        props.classOverride ?
          `${textColor} ${props.classOverride}` :
          `${textColor} flex items-center m-1 rounded p-1 whitespace-nowrap`}
      style={{backgroundColor: backgroundColorVal}} >
        {props.children}
    </div>
  );
}

export default Tag;
