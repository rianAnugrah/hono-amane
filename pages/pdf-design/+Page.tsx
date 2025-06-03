export default function PdfDesign() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid black",
          flexDirection: "column",
        }}
      >
        {/* TOP SECTION */}
        <div
          style={{
            width: "100%",
            height: "100%",

            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ width: "15%" }}>SKK</div>

          {/* MIDDLE LEFT SECTION */}
          <div
            style={{
              width: "60%",
              height: "100%",
              borderLeft: "1px solid black",
              backgroundColor: "greenyellow",
            }}
          >
            <div
              style={{
                padding: "12px",
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "1px solid black",
              }}
            >
              BARANG MILIK NEGARA
            </div>
            <div
              style={{
                padding: "4px",
                fontWeight: "bold",
                textAlign: "left",
                borderBottom: "1px solid black",
              }}
            >
              NO. SINAS
            </div>
            <div
              style={{
                padding: "4px",
                fontWeight: "bold",
                textAlign: "left",
                borderBottom: "1px solid black",
              }}
            >
              Tahun IP 
            </div>
            <div
              style={{ padding: "4px", fontWeight: "bold", textAlign: "left" }}
            >
              Deskripsi
            </div>
            <div
              style={{ padding: "4px", fontWeight: "bold", textAlign: "left" }}
            >
              &nbsp;
            </div>
          </div>

          <div
            style={{ width: "10%", height: "100%", borderLeft: "1px solid black" , borderRight: "1px solid black"}}
          >
            <div style={{ padding: "12px", borderBottom: "1px solid black" }}>
              Type Asset:
            </div>
            <div style={{ padding: "12px", textAlign: "center" }}>Ket</div>
          </div>

          {/* MIDDE RIGHT SECTION */}
          <div style={{ width: "15%" }}>
            {" "}
            <div style={{ padding: "12px", borderBottom: "1px solid black" }}>
             HCML
            </div>
            <div style={{ padding: "12px" }}>QR</div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            borderTop: "1px solid black",
            width: "100%",
            backgroundColor: "orange",
            color: "red",
            padding: "10px",
          }}
        >
          DILARANG MELEPAS / MENGECAT LABEL INI
        </div>
      </div>
    </div>
  );
}
