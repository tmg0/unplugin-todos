<template>
  <div class="w-screen min-h-screen overflow-y-auto overflow-x-hidden flex flex-col items-center relative bg-slate-200">
    <div class="w-full font-bold px-4 py-3 fixed top-0 inset-x-0 backdrop-blur-lg z-10 bg-white/50 shadow-lg shadow-black/5">
      unplugin-todos
    </div>

    <div class="pt-12 absolute top-0 mt-12 w-[42rem]">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  height: 1rem;
  width: .5rem;
}

::-webkit-scrollbar-thumb {
  --tw-border-opacity: 1;
  background-color: rgba(217,217,227,.8);
  border-color: rgba(255,255,255,var(--tw-border-opacity));
  border-radius: 9999px;
  border-width: 1px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 9999px;
}
</style>
