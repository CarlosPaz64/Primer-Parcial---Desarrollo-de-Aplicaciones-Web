import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';

// Define tu editor personalizado
class Herramientas extends ClassicEditorBase {}

Herramientas.builtinPlugins = [
  Essentials,
  Bold,
  Italic,
  Heading,
  Paragraph, // Plugin de párrafo
  Link,      // Plugin de enlace
  List,      // Plugin de lista
];

Herramientas.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'link',     // Añade el botón de enlace
      'bulletedList', // Añade el botón de lista con viñetas
      'numberedList', // Añade el botón de lista numerada
      '|',
      'undo',
      'redo',
    ],
  },
  language: 'en',
  removePlugins: ['Table', 'ImageUpload'], // Excluye plugins que no necesitas
};

export default Herramientas;