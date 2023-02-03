import fetch from "./common/fetch";

export function postUploadFile({ file }) {
  const formData = new FormData();
  formData.append(file.name, file);
  return fetch({
    url: "/pic/upload",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * @description: 用于创建文件
 * @param {*} fileInfoList: tmpPath,username,title,intro,type,other
 * @return {*}
 */
export function postCreateFiles(fileInfoList) {
  return fetch({
    url: "/pic/create",
    method: "post",
    data: {
      fileInfoList,
    },
  });
}
export function postSubmitFile({
  file,
  username = "espory",
  title = "",
  intro = "",
  type = "",
  other = "",
}) {
  const formData = new FormData();
  formData.append(file.name, file);
  formData.append("username", username);
  formData.append("title", title);
  formData.append("intro", intro);
  formData.append("type", type);
  formData.append("other", other);
  return fetch({
    url: "/upload",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
