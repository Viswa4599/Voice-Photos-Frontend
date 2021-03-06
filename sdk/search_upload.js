
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}


function submitChat(e) {
    var search_query = document.getElementById('transcript').value;
  
    var params = {
      headers: {
        param0: 'Accept:application/json',
      },
      'q' : search_query
    };
  
    // var additionalParams = {
    //   //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
    //   queryParams: {
    //       'q': search_query,
    //   },
    // };
    // var body = JSON.stringify({"q":search_query})
    var body = []
    var apigClient = apigClientFactory.newClient({apiKey:'ZYHKIb5JsB9h5ZqgiVJBi2ss1kfQ3vrh8VM9w2OU'});
      apigClient.searchGet(params,body)
      .then(function(result){
        var data =  result['data'];
        console.log(data.s3_base_url + "/"+ data.images[0]);
        // base = JSON.parse(result['data']['s3_base_url'])
        images = data.images;
        var num_images = images.length;
        if (num_images > 0){
          img_area = document.getElementById('img_area');
          removeAllChildNodes(img_area);
          var img_heading = document.createElement("H2");
          var t = document.createTextNode("Here are your images");
          img_heading.appendChild(t);
          img_area.appendChild(img_heading);
          for (let i = 0; i < num_images; i++){
            var img = document.createElement("IMG");
            img.src = data.s3_base_url + "/" + images[i];
            console.log(img.src)
            img.alt = "User's Photo";
            img.style.width = "250px"
            img.style.height = "250px"
            img.style.borderRadius = "30px"
            console.log(img)
            console.log(img_area);
            img_area.appendChild(img);
            img_area.appendChild (document.createTextNode (" "));
            img_area.appendChild (document.createElement ("span"));
        
          }
        }
        else{
            img_area = document.getElementById('img_area')
            removeAllChildNodes(img_area);
            var img_heading = document.createElement("H1");
            var t = document.createTextNode("Sorry! no images found");
            img_heading.appendChild(t);
            img_area.appendChild(img_heading);
          }
        });
  
  }
  

function callPutApi(message) {
    // params, body, additionalParams
    return sdk.folderObjectPut({},message, {});
  }
  
function handleFileSelect(evt) {
var filesSelected = document.getElementById("fileupload").files;
var imageTags = document.getElementById("imagetags").value;
  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];

    var fileReader = new FileReader();

    fileReader.onload = function(fileLoadedEvent) {
    var srcData = fileLoadedEvent.target.result; // <--- data: base64
    


    console.log(fileToLoad.name)
    var solution = srcData.split("base64,")[1];
    console.log("Converted Base64 version is " + solution);
    console.log(solution);
    var body = solution;
    //callPutApi(body)
    console.log(imageTags)
    var params = {
      headers: {
          param0: 'Accept:application/json',
          'x-amz-meta-customLabels': imageTags,
          'Content-Type': 'image/jpeg',
      },
      'Content-Type': 'image/jpeg;base64',
      'x-amz-meta-customLabels': imageTags,
      'folder': 'ai-photos-b2',
      'object': fileToLoad.name,
      
      };

    var apigClient = apigClientFactory.newClient({apiKey:'ZYHKIb5JsB9h5ZqgiVJBi2ss1kfQ3vrh8VM9w2OU'});
    console.log(apigClient)
    apigClient.folderObjectPut(params, body,{})
    .then(function(result){
    console.log('went to then')
    alert("Succesfully uploaded!");
    }).catch( function(result){
    console.log('went to catch')
    });

    }
    fileReader.readAsDataURL(fileToLoad);
    }
  else{
    console.log("Invalid file selected");
  }
}