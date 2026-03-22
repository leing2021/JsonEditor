import { JSONEditor } from 'vanilla-jsoneditor';
import { useEffect, useRef } from 'react';

export default function VanillaJSONEditor(props: any) {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<any>(null);

  useEffect(() => {
    // create editor
    if (refContainer.current) {
      refEditor.current = new (JSONEditor as any)({
        target: refContainer.current,
        props: props
      });
    }

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return <div className="vanilla-jsoneditor-react h-full w-full" ref={refContainer}></div>;
}
