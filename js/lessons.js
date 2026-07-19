/**
 * TermiType - Lesson Database
 * Contains real-world exercises for Junior DBAs and Linux Sysadmins.
 */

const LESSON_CATEGORIES = [
    { id: "all", name: "Semua Kategori", icon: "code" },
    { id: "linux", name: "Linux Basic for DBA", icon: "terminal" },
    { id: "sql", name: "Oracle SQL & PL/SQL", icon: "database" },
    { id: "admin", name: "Oracle Administration", icon: "settings" },
    { id: "rman", name: "RMAN & Backup", icon: "shield-check" },
    { id: "custom", name: "Custom Lessons", icon: "edit-3" }
];

const DEFAULT_LESSONS = [
    // --- LINUX BASIC FOR DBA ---
    {
        id: "lnx_001",
        category: "linux",
        difficulty: "Easy",
        title: "Cek Proses Background Oracle (PMON)",
        description: "Melihat proses pmon Oracle dan memantau alert log secara real-time.",
        code: `ps -ef | grep pmon\ntail -200f /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log`
    },
    {
        id: "lnx_002",
        category: "linux",
        difficulty: "Easy",
        title: "Cek Use Space Disk & Memory System",
        description: "Perintah mendasar untuk memeriksa kapasitas mount point dan pemakaian RAM server.",
        code: `df -h /u01\nfree -h\ntop -c -u oracle`
    },
    {
        id: "lnx_003",
        category: "linux",
        difficulty: "Medium",
        title: "Pindah User & Setting Oracle Environment Variable",
        description: "Login sebagai user oracle dan muat variabel lingkungan database.",
        code: `su - oracle\nexport ORACLE_SID=orcl\nexport ORACLE_HOME=/u01/app/oracle/product/19.0.0/dbhome_1\nenv | grep ORACLE`
    },
    {
        id: "lnx_004",
        category: "linux",
        difficulty: "Medium",
        title: "Cek Port Listener & Status Oracle Listener",
        description: "Memeriksa port 1521 dengan netstat/ss dan mengecek status listener lsnrctl.",
        code: `netstat -tulnp | grep 1521\nlsnrctl status LISTENER\nlsnrctl services`
    },
    {
        id: "lnx_005",
        category: "linux",
        difficulty: "Hard",
        title: "Cari File Trace & Dump Terbesar di Linux",
        description: "Navigasi dan pencarian file trace besar yang memenuhi storage Oracle.",
        code: `find /u01/app/oracle/diag -name "*.trc" -size +100M -exec ls -lh {} \\;\ndu -sh /u01/app/oracle/fast_recovery_area/* | sort -rh | head -10`
    },

    // --- ORACLE SQL & PL/SQL ---
    {
        id: "sql_001",
        category: "sql",
        difficulty: "Easy",
        title: "Cek Status Instance & Versi Oracle",
        description: "Query dasar dari v$instance dan v$version untuk cek ketersediaan DB.",
        code: `SELECT instance_name, host_name, status, database_status FROM v$instance;\nSELECT banner FROM v$version WHERE ROWNUM = 1;`
    },
    {
        id: "sql_002",
        category: "sql",
        difficulty: "Medium",
        title: "Cek Session Active & Running Query",
        description: "Identifikasi session pengguna yang sedang aktif dan query SQL yang sedang dieksekusi.",
        code: `SELECT s.sid, s.serial#, s.username, s.program, s.status, q.sql_text\nFROM v$session s\nJOIN v$sql q ON s.sql_id = q.sql_id\nWHERE s.type != 'BACKGROUND' AND s.status = 'ACTIVE';`
    },
    {
        id: "sql_003",
        category: "sql",
        difficulty: "Medium",
        title: "PL/SQL Block Sederhana dengan Exception Handling",
        description: "Menulis blok PL/SQL anonim untuk pengujian pesan output dan penanganan error.",
        code: `SET SERVEROUTPUT ON;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE('Checking Oracle Database connection status...');\nEXCEPTION\n  WHEN OTHERS THEN\n    DBMS_OUTPUT.PUT_LINE('Error code: ' || SQLCODE || ' - ' || SQLERRM);\nEND;\n/`
    },
    {
        id: "sql_004",
        category: "sql",
        difficulty: "Hard",
        title: "PL/SQL Stored Procedure Rebuild Unusable Index",
        description: "Otomatisasi perbaikan index berstatus UNUSABLE dalam satu schema.",
        code: `CREATE OR REPLACE PROCEDURE rebuild_invalid_indexes AS\nBEGIN\n  FOR i IN (SELECT index_name FROM user_indexes WHERE status = 'UNUSABLE') LOOP\n    EXECUTE IMMEDIATE 'ALTER INDEX ' || i.index_name || ' REBUILD ONLINE';\n  END LOOP;\nEND;\n/`
    },
    {
        id: "sql_005",
        category: "sql",
        difficulty: "Medium",
        title: "Monitoring Blocking Lock Session",
        description: "Query v$lock dan v$session untuk mendeteksi session yang saling mengunci (deadlock/wait lock).",
        code: `SELECT l1.sid || ' is blocking ' || l2.sid AS blocking_status\nFROM v$lock l1, v$lock l2\nWHERE l1.block = 1 AND l2.request > 0 AND l1.id1 = l2.id1 AND l1.id2 = l2.id2;`
    },

    // --- ORACLE ADMINISTRATION ---
    {
        id: "adm_001",
        category: "admin",
        difficulty: "Easy",
        title: "Switch Redo Logfile & Force Checkpoint",
        description: "Memaksa pergantian logfile dan rotasi arsip log di Oracle DB.",
        code: `ALTER SYSTEM SWITCH LOGFILE;\nALTER SYSTEM CHECKPOINT;`
    },
    {
        id: "adm_002",
        category: "admin",
        difficulty: "Medium",
        title: "Pembuatan Tablespace Baru dengan Autoextend",
        description: "Perintah DDL DBA untuk menambah storage tablespace dengan autoextend.",
        code: `CREATE TABLESPACE ts_finance_data\nDATAFILE '/u01/app/oracle/oradata/ORCL/ts_finance01.dbf' SIZE 500M\nAUTOEXTEND ON NEXT 50M MAXSIZE 2G\nEXTENT MANAGEMENT LOCAL UNIFORM SIZE 1M;`
    },
    {
        id: "adm_003",
        category: "admin",
        difficulty: "Medium",
        title: "Manajemen User, Password, & Privilege DBA",
        description: "Membuat user baru, mengatur quota tablespace, dan memberikan hak akses.",
        code: `CREATE USER dba_junior IDENTIFIED BY "P@ssw0rdDBA2026"\nDEFAULT TABLESPACE users TEMPORARY TABLESPACE temp;\nALTER USER dba_junior QUOTA UNLIMITED ON users;\nGRANT CONNECT, RESOURCE, CREATE SESSION TO dba_junior;`
    },
    {
        id: "adm_004",
        category: "admin",
        difficulty: "Hard",
        title: "Shutdown Immediate & Startup Mount Mode",
        description: "Perintah maintenance restart instance Oracle hingga tahap mount.",
        code: `sqlplus / as sysdba\nSHUTDOWN IMMEDIATE;\nSTARTUP MOUNT;\nALTER DATABASE OPEN READ ONLY;\nSELECT open_mode FROM v$database;`
    },
    {
        id: "adm_005",
        category: "admin",
        difficulty: "Hard",
        title: "Resize SGA & PGA Target Memory Dynamic",
        description: "Mengatur parameter memori utama Oracle Database tanpa restart (SCOPE=BOTH).",
        code: `ALTER SYSTEM SET sga_target = 4G SCOPE=BOTH;\nALTER SYSTEM SET pga_aggregate_target = 2G SCOPE=BOTH;\nSHOW PARAMETER sga;`
    },

    // --- RMAN & BACKUP ---
    {
        id: "rman_001",
        category: "rman",
        difficulty: "Easy",
        title: "Koneksi ke RMAN Target System",
        description: "Perintah CLI untuk memulai sesi Recovery Manager dari terminal Linux.",
        code: `rman target /\nSHOW ALL;`
    },
    {
        id: "rman_002",
        category: "rman",
        difficulty: "Medium",
        title: "Full Database Backup plus Archivelog",
        description: "Eksekusi backup penuh database beserta seluruh file log arsip ke disk.",
        code: `RMAN> BACKUP DATABASE PLUS ARCHIVELOG DELETE INPUT;`
    },
    {
        id: "rman_003",
        category: "rman",
        difficulty: "Medium",
        title: "Crosscheck Backup & Delete Obsolete",
        description: "Verifikasi keberadaan backup set fisik dan hapus backup kadaluarsa.",
        code: `CROSSCHECK BACKUP;\nCROSSCHECK ARCHIVELOG ALL;\nDELETE NOPROMPT OBSOLETE;\nDELETE NOPROMPT EXPIRED BACKUP;`
    },
    {
        id: "rman_004",
        category: "rman",
        difficulty: "Hard",
        title: "Script Incremental Backup Level 1 RMAN",
        description: "Script otomatisasi backup diferensial level 1 dengan tag nama khusus.",
        code: `RUN {\n  ALLOCATE CHANNEL ch1 DEVICE TYPE DISK;\n  BACKUP INCREMENTAL LEVEL 1 DATABASE TAG 'INC_L1_DAILY';\n  RELEASE CHANNEL ch1;\n}`
    },
    {
        id: "rman_005",
        category: "rman",
        difficulty: "Hard",
        title: "Restore & Recover Database Validation",
        description: "Menguji validasi proses restore database tanpa menimpa data produksi.",
        code: `RESTORE DATABASE VALIDATE;\nRESTORE ARCHIVELOG ALL VALIDATE;\nREPORT NEED BACKUP;`
    }
];
