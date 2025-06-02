export default Page;

function Page() {
  return (
    <>
      <form action="/api/upload" method="post" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}
