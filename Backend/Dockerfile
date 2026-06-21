# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution & csproj files first for layer caching
COPY ["ReactApi/ReactApi.sln",                                        "ReactApi/"]
COPY ["ReactApi/ReactApi.csproj",                                     "ReactApi/"]
COPY ["ReactApi.Application/ReactApi.Application.csproj",            "ReactApi.Application/"]
COPY ["ReactApi.Domin/ReactApi.Domin.csproj",                        "ReactApi.Domin/"]
COPY ["ReactApi.Infrastructer/ReactApi.Infrastructer.csproj",        "ReactApi.Infrastructer/"]

RUN dotnet restore "ReactApi/ReactApi.sln"

# Copy everything else and publish
COPY . .
RUN dotnet publish "ReactApi/ReactApi.csproj" -c Release -o /app/publish --no-restore

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# PORT env var — Render uses $PORT automatically
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "ReactApi.dll"]
