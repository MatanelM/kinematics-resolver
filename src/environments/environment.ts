// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  bar: function(n) {
    console.log(n)
  },
  rootDelta: function (a, b, c){
    let r = Math.sqrt( Math.pow(Number(b),2) - ( 4 * Number(a) * Number(c)));
    if ( isNaN(r)){
        console.error('error - in getDelta - cannot get root of negative number');
    }
    return r;
  },
  quadricEquation: function quadricEquation(a, b, c){
    let root_delta = environment.rootDelta(a, b, c);

    let r1 = (-Number(b) + Number(root_delta)) / ( 2 * Number(a) );
    let r2 = (-Number(b) - Number(root_delta)) / ( 2 * Number(a) );
    
    console.log(r1, r2);
    
    return [r1, r2];
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
