<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
html {
  -webkit-user-select: none;
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body, html {
  border-radius: 10px !important;
  overflow: hidden;
}

body {
  background-color: #252525;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

::-webkit-scrollbar-track
{
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar
{
  width: 6px;
  height: 6px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
  border-radius: 50px;
  background-color: #d2d2d2;
}

.darkscroll::-webkit-scrollbar
{
  background-color: #404040;
}

.darkscroll::-webkit-scrollbar-track
{
  background-color: #343a40;
}

.darkscroll::-webkit-scrollbar-thumb
{
  background-color: #555;
}

.loading::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  background-image: url('/loading.svg');
  background-color: rgba(255, 255, 255, 0.9);
  background-position: center center;
  background-repeat: no-repeat;
}

.loading-dark::after{
  background-color: rgba(0, 0, 0, 0.8);
}

a, .clickable {
  cursor: pointer;
}

.draggable {
  -webkit-app-region: drag;
}

.draggable-0 {
  -webkit-app-region: none;
}

.bg-darker {
  background-color: #252525;
}

</style>
