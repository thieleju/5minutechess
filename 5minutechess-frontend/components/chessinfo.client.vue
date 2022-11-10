<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from "vue";
</script>

<template>
  <div class="title">
    <v-icon class="my-auto" left>mdi-information</v-icon>
    <p class="titleText text-h6">Info</p>
    <v-spacer></v-spacer>
  </div>
  <div class="chessinfo"></div>
</template>

<style lang="scss">
.chessinfo {
  width: 500px;
  height: 500px;
  margin: auto;
  padding: auto;
}

.container {
  //max-height: 600px;
  max-width: 80vh;
  background-color: #2d2d2d;
  //margin-top: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0px;
  border-radius: 10px;
  //z-index: 5;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.headCont {
  display: flex;
  flex-direction: column;
  min-height: 20vh;
}

.innerPadding {
  padding: 10px;
}

.title {
  display: flex;
  background: #38a3a5;
  margin: 0;
  margin-right: 0;
  // margin-left: -12px;
  // margin-top: -12px;
  border-radius: 10px 10px 0 0;
  padding: 10px;
  padding-left: 15px;
  padding-bottom: 7px;
  //border-bottom: solid 3px #2d2d2d;
}

.titleText {
  margin-left: 10px;
}

.textInputHeading {
  padding-top: 8vh;
}
</style>
