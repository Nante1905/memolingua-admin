import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
} from "mui-tiptap";
import React from "react";
import "./rich-text.component.scss";

interface RichTextProps {
  onContentChange: (content: string) => void;
  label: string;
  className?: string;
  defaultValue?: string;
}

const RichText: React.FC<RichTextProps> = (props) => {
  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: props.defaultValue ?? "",
      onUpdate: ({ editor }) => {
        props.onContentChange(editor.getHTML());
      },
    },
    [props.defaultValue]
  );

  return (
    <div
      className={`richTextContainer ${props.className ? props.className : ""}`}
    >
      <label htmlFor="mission" className="label">
        {props.label}
      </label>
      <RichTextEditorProvider editor={editor}>
        <RichTextField
          controls={
            <MenuControlsContainer className="richtext-menu">
              <MenuSelectHeading />

              <MenuDivider />
              <MenuButtonBold />
              <MenuButtonItalic />
              <MenuButtonBulletedList />
            </MenuControlsContainer>
          }
        />
      </RichTextEditorProvider>
    </div>
  );
};

export default RichText;
