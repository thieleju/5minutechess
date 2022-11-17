<script setup></script>

<template>
  <v-main>
    <!-- <client-only placeholder="Loading..."> -->
    <v-row align="center">
      <v-col
        cols="12"
        xl="9"
        md="9"
        sm="11"
        xs="11"
        class="container mr-xl-2 mr-md-auto"
      >
        <chessboard></chessboard>
      </v-col>
      <v-col
        cols="12"
        xl="3"
        md="3"
        sm="11"
        xs="11"
        class="container ml-xl-2 ml-md-auto"
      >
        <chessinfo></chessinfo>
      </v-col>
    </v-row>
    <!-- </client-only> -->
  </v-main>
</template>

<style lang="scss">
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
</style>
