import fetch from "./common/fetch";

export function postUploadFile({
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
