import axios from "axios";

export const handleInputChange = (event, user) => {
  let reader = new FileReader();

  var userInfo = {
    file: [],
    filepreview: null,
  };
  var invalidImage = null;
  const imageFile = event.target.files[0];
  const imageFilname = event.target.files[0].name;

  if (!imageFile) {
    invalidImage = "Please select image.";
    return false;
  }

  if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
    invalidImage = "Please select valid image JPG,JPEG,PNG";
    return false;
  }
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      //------------- Resize img code ----------------------------------
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var MAX_WIDTH = 437;
      var MAX_HEIGHT = 437;
      var width = img.width;
      var height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      ctx.canvas.toBlob(
        (blob) => {
          const file = new File([blob], imageFilname, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          console.log("file", file);
          userInfo = {
            ...userInfo,
            file: file,
            filepreview: URL.createObjectURL(imageFile),
          };
          console.log("userInfo", userInfo);
        },
        "image/jpeg",
        1
      );
      invalidImage = null;
    };
    img.onerror = () => {
      invalidImage = "Invalid image content.";
      return false;
    };
    //debugger
    img.src = e.target.result;
  };
  reader.readAsDataURL(imageFile);
  return submit(userInfo.file, user);
};

const submit = async (file, user) => {
  console.log("submitfile", file);
  const formdata = new FormData();
  formdata.append("file", file);
  const { data } = await axios.post("/api/upload", formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${user.token}`,
    },
  });
  return data.secure_url;
  //   .then((res) => {
  //     // then print response status
  //     console.warn(res);
  //     if (res.data.success === 1) {
  //       setSuccess("Image upload successfully");
  //     }
  //   });
};
