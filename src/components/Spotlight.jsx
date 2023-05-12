import { useRef } from 'react';

const Spotlight = (props) => {
  const targetRef = useRef();

  return (
    <spotLight
      ref={targetRef}
      position={props.position}
      angle={props.angle}
      penumbra={props.angle}
      castShadow
    />
  );
};
export default Spotlight;
