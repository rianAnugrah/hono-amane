export default Page;

function Page() {
  // Upload file tunggal
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data));

  // Upload multiple
  const formData = new FormData();
  for (const file of fileInput.files) {
    formData.append("file", file);
  }

  fetch("/api/upload/multiple", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  return (
    <>
      <form action="/api/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}
