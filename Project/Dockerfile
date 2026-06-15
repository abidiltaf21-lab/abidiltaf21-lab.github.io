# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution & restore
COPY ["ReactApi.sln", "./"]
COPY ["ReactApi/ReactApi.csproj",                     "ReactApi/"]
COPY ["ReactApi.Application/ReactApi.Application.csproj", "ReactApi.Application/"]
COPY ["ReactApi.Domin/ReactApi.Domin.csproj",         "ReactApi.Domin/"]
COPY ["ReactApi.Infrastructer/ReactApi.Infrastructer.csproj", "ReactApi.Infrastructer/"]

RUN dotnet restore "ReactApi.sln"

# Copy everything and publish
COPY . .
RUN dotnet publish "ReactApi/ReactApi.csproj" -c Release -o /app/publish

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Railway injects PORT env var
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "ReactApi.dll"]
