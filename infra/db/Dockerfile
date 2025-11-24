FROM postgres:18

# 先装一些工具：curl / ca-certificates / gnupg / lsb-release
# 安装依赖 + 用 curl 抓 GPG key
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl \
      ca-certificates \
      gnupg \
      lsb-release && \
    rm -rf /var/lib/apt/lists/*

# 添加 PostgreSQL 官方 PGDG 仓库 + 导入 GPG key
RUN set -eux; \
    echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
      > /etc/apt/sources.list.d/pgdg.list; \
    curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
      | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg

# 更新并安装 pgvector + PostGIS（注意都是 18 版本）
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      postgresql-18-pgvector \
      postgresql-18-postgis-3 \
      postgresql-18-postgis-3-scripts && \
    rm -rf /var/lib/apt/lists/*