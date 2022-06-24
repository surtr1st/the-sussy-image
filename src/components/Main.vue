<template>
    <div class="grid-layout">
        <nav id="navi" class="sidebar grid">
            <RouterLink to="/specific-place" class="btn">
                <font-awesome-icon icon="fa-solid fa-folder-plus" size="3x" />
            </RouterLink>
            <RouterLink to="/all-in-one" class="btn">
                <font-awesome-icon icon="fa-solid fa-rectangle-list" size="3x" />
            </RouterLink>
            <RouterLink to="/duplicated-found" class="btn">
                <font-awesome-icon icon="fa-solid fa-copy" size="3x" />
            </RouterLink>
            <a class="btn" @click.prevent="require('electron').ipcRenderer.send('close')">
                <font-awesome-icon icon="fa-solid fa-circle-xmark" size="3x" />
            </a>
        </nav>
        <RouterView />
    </div>
</template>

<script setup>
window.scroll({
    behavior: "smooth"
})
</script>

<style lang="scss" scoped>
@import '../assets/sass/global.sass';
@import '../assets/sass/responsive.sass';
.sidebar {
    height: 100vh;
    background: hsl(231, 61%, 58%);
}

.grid {
    display: grid;
    place-items: center;
}

.btn {
    display: grid;
    place-items: center;
    color: white;
    width: 10vh;
    height: 10vh;
    border: 1px solid transparent;
    border-radius: 7px;
    text-decoration: none;
    transition: all 500ms;
}

.btn:hover {
    cursor: pointer;
    border: 1px solid white;
    transition: all 500ms;
}
</style>