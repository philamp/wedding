<script>


	import { onMount } from 'svelte';
	import { storeReady, connectionStatus, mapOpened} from '/src/store.js';

    import FilePond, { registerPlugin, supported } from 'svelte-filepond';
    import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
    import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
    registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

    // a reference to the component, used to call FilePond methods
let pond;

// pond.getFiles() will return the active files

// the name to use for the internal file input
let name = 'filepond';



// handle filepond events
function handleInit() {
	console.log('FilePond has initialised');
}

function handleAddFile(err, fileItem) {
	console.log('A file has been added', fileItem);
}


</script>
<div id="central-content">

test

<FilePond bind:this={pond} {name}
server="/api"
allowMultiple={true}
oninit={handleInit}
onaddfile={handleAddFile}
acceptedFileTypes={['image/*']},
/>

</div>
<style global lang="postcss">
@import 'filepond/dist/filepond.css';
@import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

</style>


