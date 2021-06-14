import React, { useState } from 'react';
import TagsInput from 'react-tagsinput'
 
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
 
const FormTagInput = () => {
  const [tags, setTags] = useState([]);

  const handleChange = (tags: any) => {
    setTags(tags)
  }
 
    return <TagsInput value={tags} onChange={handleChange} />
}

export default FormTagInput;