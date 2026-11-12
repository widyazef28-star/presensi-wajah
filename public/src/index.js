export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {
      if (url.pathname === "/api/mahasiswa" && request.method === "POST") {
        const data = await request.json();

        await env.DB.prepare(
          "INSERT OR REPLACE INTO mahasiswa (nim, nama) VALUES (?, ?)"
        ).bind(data.nim, data.nama).run();

        return Response.json(
          { success: true, message: "Mahasiswa berhasil disimpan" },
          { headers }
        );
      }

      if (url.pathname === "/api/mahasiswa" && request.method === "GET") {
        const result = await env.DB.prepare(
          "SELECT * FROM mahasiswa ORDER BY nama"
        ).all();

        return Response.json(result.results, { headers });
      }

      if (url.pathname === "/api/presensi" && request.method === "POST") {
        const data = await request.json();

        await env.DB.prepare(
          "INSERT INTO presensi (nim, tanggal, waktu, status) VALUES (?, ?, ?, ?)"
        ).bind(data.nim, data.tanggal, data.waktu, "HADIR").run();

        return Response.json(
          { success: true, message: "Presensi berhasil disimpan" },
          { headers }
        );
      }

      if (url.pathname === "/api/presensi" && request.method === "GET") {
        const result = await env.DB.prepare(
          "SELECT * FROM presensi ORDER BY id DESC"
        ).all();

        return Response.json(result.results, { headers });
      }

      if (url.pathname === "/") {
        return env.ASSETS.fetch(request);
      }

      return Response.json(
        { success: false, message: "Endpoint tidak ditemukan" },
        { status: 404, headers }
      );

    } catch (error) {
      return Response.json(
        { success: false, message: error.message },
        { status: 500, headers }
      );
    }
  }
};
