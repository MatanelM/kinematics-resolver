import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kinematics-calculator-component';

  req;
  holdValues = [];
  canBeSolved = false;
  message = '';
  solvedBy = '';
  answer:any = '';
  
  methods = ['V=V0+AT', 'Vt^2=V0^2+2a(Xt-X0)', 'X=X0+VT', 'X=X0+T(Vt+V0)/2', 'X=X0+V0T+(AT^2)/2']

  acceleration: Number;
  position: Number;
  starting_position: Number;
  velocity: Number;
  starting_velocity: Number;
  time: Number;
  position_delta: Number;
  velocity_delta: Number;

  messages = {
    'no_requsted_value': 'Please pick a value to find',
    'cannot_be_solved': 'Cannot be solved by these values only'
  }

  checkValues(){
    this.updateHoldValues()
  }

  updateHoldValues(value: string = null){

    if ( value != null ){
      let hadValue = false;
      this.holdValues.forEach( (elem, ind) => {
        if ( elem == value ) {
          this.holdValues.splice(ind, 1);
          hadValue = true;
        }
      })
      if (!hadValue) {
        this.holdValues.push(value);
      }
    }

    if ( !this.req ) {
      this.message = this.messages['no_requsted_value'];
      return;
    } else {
      this.message = '';
    }

    if (!this.solveProblem()) {
      this.message = this.messages['cannot_be_solved'];
    }else{
      this.message = '';
      this.answer = 'NaN';
    }


  }

  solveProblem( ){
    let a = this.holdValues.indexOf('acceleration') == -1 ? false : true;
    let x = this.holdValues.indexOf('position') == -1 ? false : true;
    let x0 = this.holdValues.indexOf('starting_position') == -1 ? false : true;
    let v = this.holdValues.indexOf('velocity') == -1 ? false : true;
    let v0 = this.holdValues.indexOf('starting_velocity') == -1 ? false : true;
    let t = this.holdValues.indexOf('time') == -1 ? false : true;
    console.log(a, x, x0, v, v0, t)
    console.log(this.holdValues);
    
    if( x && x0 ){
      this.position_delta = Number(this.position) - Number(this.starting_position);
    }else{
      this.position_delta = undefined;
    }
    if ( v && v0 ){
      this.velocity_delta = Number(this.velocity)-Number(this.starting_velocity);
    }else{
      this.velocity_delta = undefined;
    }

    switch ( this.req ) {
      case 'acceleration': 
        if ( t && v && v0 ) {
         this.solvedBy = this.methods[0]
         this.answer = this.calcAccelerationByTimeVelocity();
        }else if ( v && v0 && x && x0 ){
          this.solvedBy = this.methods[1]
          this.answer = this.findAccelerationByVelocityFunction()
        }else if ( t && x && v0 && v){
          this.solvedBy = this.methods[4]
          this.answer = this.findAccelerationByTimeLocationAcceleration();
        }else {
          return false;
        }break;
      case 'time': 
        if ( v0 && a && v ){
          this.solvedBy = this.methods[0];
          this.answer = this.calcTimeByTimeVelocity( );
        }else if ( v && v0 && x0 && x ){
          this.solvedBy = this.methods[3];
          this.answer = this.findTimeByConstantVelocity();
        }else if ( x && x0 && v0 && a){
          this.solvedBy = this.methods[4];
          this.answer = this.findTimeByTimeLocationAcceleration();
        }else if ( x && x0 && v ){
          // const
          this.solvedBy = this.methods[2]
          this.answer = this.findTimeByAverageVelocity()
        }else{
          return false;
        }break;
      case 'starting_velocity': 
        if ( v && a && t ){
          this.solvedBy = this.methods[0];
          this.answer = this.calcStartingVelocityByTimeVelocity();
        }else if ( x && x0 && t && a ){
          this.solvedBy = this.methods[4]
          this.answer = this.findStartingVelocityByTimeLocationAcceleration();
        }else if ( v && a && x && x0 ){
          this.solvedBy = this.methods[1]
          this.answer = this.findStartingVelocityByVelocityFunction();
        }else if ( x && v && x0 && t ){
          this.solvedBy = this.methods[3]
          this.answer = this.findStartingVelocityByAverageVeloicty();
        }else {
          return false;
        }break;
      case 'velocity':
        if ( v0 && a && t ){
          this.solvedBy = this.methods[0]
          this.answer = this.calcVelocityByTimeVelocity()
        }else if ( v0 && a && x0 && x ){
          this.solvedBy = this.methods[1]
          this.answer = this.findVelocityByVelocityFunction()
        }else if ( x0 && x && v0 && x ){
          this.solvedBy = this.methods[3]
          this.answer = this.findCurrentVelocityByAverageVelocity();
        }else if ( x && x0 && t ){
          // const
          this.solvedBy = this.methods[2]
          this.answer = this.findVelocityByConstantVelocity();
        }else {
          return false;
        }break;
      case 'starting_position': 
        if ( v && v0 && a && t ){
          this.solvedBy = this.methods[1]
          this.answer = this.findStartingPositionByVelocityFunction();
        }else if (x && v && v0 && t){
          this.solvedBy = this.methods[3]
          this.answer = this.findStartingPositionByAverageVelocity();
        }else if(x && v0 && t && a) {
          this.solvedBy = this.methods[4]
          this.answer = this.findStartingPositionByTimeLocationAcceleration();
        }else if (x && v && t){
          // const
          this.solvedBy = this.methods[2]
          this.answer = this.findStartingPositionByConstantVelocity();
        }else {
          return false;
        }break;
      case 'position':
        if ( v && v0 && a && x0){
          this.solvedBy = this.methods[1]
          this.answer = this.findPositionByVelocityFunction()
        }else if(x0 && v && v0 && t){
          this.solvedBy = this.methods[3]
          this.answer = this.findPositionByAverageVelocity();
        }else if(x0 && v0 && t && a){
          this.solvedBy = this.methods[4]
          this.answer = this.findPositionByTimeLocationAcceleration();
        }else if(x0 && v && t){
          // const
          this.solvedBy = this.methods[2];
          this.answer = this.findPositionByConstantVelocity()
        }else{
          return false;
        }break;
    }
    return true;

  }

  /* Time Velocity */
  calcAccelerationByTimeVelocity(){
    let vel = this.velocity_delta;
    let time = Number(this.time);
    
    return Math.round(Number(vel)/Number(time) * 1000)/1000 + '[m/s^2]';
  }
  calcVelocityByTimeVelocity() {
    let acc = Number(this.acceleration);
    let time = Number(this.time);
    let start = Number(this.starting_position);
    return Math.round((start + time * acc) *1000)/1000 + '[mps]';
  }
  calcTimeByTimeVelocity(){
    let acc = Number(this.acceleration);
    let start = Number(this.starting_velocity);
    let current = Number(this.velocity);
    return Math.round(((Number(current) - Number(start)) / Number(acc)) *1000)/1000 + '[s]'
  }
  calcStartingVelocityByTimeVelocity(){
    let acc = Number(this.acceleration);
    let time =  Number(this.time);
    let current = Number(this.velocity);
    
    return Math.round( (current - acc * time) *1000)/1000 + '[mps]';
  }

  /* Time Location Acceleration */
  findPositionByTimeLocationAcceleration(){
    let acc = Number(this.acceleration), 
        time = Number(this.time), 
        start_pos = Number(this.starting_position), 
        start_vel = Number(this.starting_velocity);
    return Math.round( (Number(start_pos) + ( Number(start_vel) * time ) + ( ( Number(acc) * Math.pow(Number(time), 2) ) / 2) ) * 1000)/1000 + '[m]';
  }
  findPositionByTimeLocationAccelerationRested(){
    let acc = Number(this.acceleration), time = Number(this.time);
    return Math.round( (Number(acc) * Math.pow(Number(time), 2) / 2) *1000)/1000 + '[m]';
  }
  findTimeByTimeLocationAcceleration(){
      let acc = Number(this.acceleration);
      let current_pos = Number(this.position);
      let start_pos = Number(this.starting_position);
      let start_vel = Number(this.starting_velocity);

      let a = Number(acc) / 2;
      let b = Number(start_vel);
      let c = Number(start_pos) - Number(current_pos);

      let t12 = environment.quadricEquation(a,b,c);
      let ans = t12[1] > 0 ? 
        t12[1]
        : t12[0];
      return Math.round( ans * 1000)/1000 + '[s]';
  }

  findAccelerationByTimeLocationAcceleration(){
    let time =  Number(this.time);
    let current_pos = Number(this.position);
    let start_pos = Number(this.starting_position);
    let start_vel = Number(this.starting_velocity);
    
    return Math.round( (Number(current_pos) - Number(start_pos) - (Number(start_vel) * Number(time)) - ( Math.pow(Number(time),2) / 2 ) ) *1000)/1000 + '[m/s^2]'
  }

  findStartingPositionByTimeLocationAcceleration() {
    let acc = Number(this.acceleration), 
        time =  Number(this.time), 
        current_pos = Number(this.position), 
        start_vel = Number(this.starting_velocity);
    return -Math.round ( (Number(start_vel) * Number(time) + (Number(acc) * Math.pow(Number(time), 2) / 2) - Number(current_pos) ) *1000)/1000 + '[m]';
  }

  findStartingVelocityByTimeLocationAcceleration(){
    let acc = Number(this.acceleration), 
        time =  Number(this.time), 
        current_pos = Number(this.position), 
        start_pos = Number(this.starting_position);
    return -Math.round( (Number(start_pos) - Number(current_pos) + (Number(acc) * Math.pow(Number(time), 2))/2 )/Number(time) *1000)/1000 + '[mps]';
  }

  /* Velocity 2 */
  findVelocityByVelocityFunction() {
    let 
        start_vel = Number(this.starting_velocity), 
        acc= Number(this.acceleration), 
        change= Number(this.position_delta)
    return Math.round(Math.sqrt( Math.pow(start_vel, 2) + 2 * acc * change) *1000)/1000 + '[mps]';
  }
  findStartingVelocityByVelocityFunction() {
    let current_vel = Number(this.velocity), 
        acc = Number(this.acceleration), 
        change = Number(this.position_delta)
    
    return Math.round( Math.sqrt( Math.pow(current_vel, 2) - 2 * acc * change) *1000)/1000 + '[mps]';
  }
  findAccelerationByVelocityFunction() {
    let current_vel = Number(this.velocity), 
        start_vel = Number(this.starting_velocity), 
        change = Number(this.position_delta)
    return Math.round(( Math.pow(Number(current_vel), 2) - Math.pow(Number(start_vel), 2) ) / (Number(change) * 2)*10000)/1000 + '[m/s^2]';
  }
  findChangeByVelocityFunction() {
    let current_vel = Number(this.velocity), 
        start_vel = Number(this.starting_velocity), 
        acc = Number(this.acceleration);
    return Math.round( ((Math.pow(current_vel, 2) - Math.pow(start_vel, 2)) / (2 * acc) ) *1000)/1000 + '[m]';
  }
  findStartingPositionByVelocityFunction() {
    let current_vel = Number(this.velocity);
    let start_vel = Number(this.starting_velocity);
    let acceleration = Number(this.acceleration);
    let pos = Number(this.position);

    return Math.round( ( ( Math.pow(start_vel, 2) + (2 * acceleration * pos ) - Math.pow(current_vel, 2))/(2*acceleration) ) *1000)/1000 + '[m]';
  }
  findPositionByVelocityFunction(){
    let current_vel = Number(this.velocity);
    let start_vel = Number(this.starting_velocity);
    let acceleration = Number(this.acceleration);
    let start_pos = Number(this.position);

    return Math.round( ( (Math.pow(current_vel, 2) - Math.pow(start_vel, 2) + ( 2 * acceleration * start_pos))/(2*acceleration) ) *1000)/1000+ '[m]'
  }
  /* Position by average velocity */
  findPositionByAverageVelocity(){
    let start_pos = Number(this.starting_position), 
        start_vel = Number(this.starting_velocity), 
        current_vel = Number(this.velocity), 
        time =  Number(this.time);
    return Math.round(( (start_vel + current_vel) / 2 ) * Number(time) + Number(start_pos) *1000)/1000 + '[m]';
  }
  findStartingPositionByAverageVelocity() {
    let current_pos = Number(this.position), 
        start_vel = Number(this.starting_velocity), 
        current_vel = Number(this.velocity), 
        time =  Number(this.time);
    return -Math.round( ( (start_vel + current_vel) / 2 ) * Number(time) - Number(current_pos) *1000)/1000 + '[m]';
  }
  findCurrentVelocityByAverageVelocity() {
    let current_pos = Number(this.position), 
        start_pos = Number(this.starting_position), 
        start_vel = Number(this.starting_velocity), 
        time =  Number(this.time);
    return Math.round( (current_pos-start_pos-( time*start_vel/2 )) / (time/2) *1000)/1000 + '[mps]';
  }
  findStartingVelocityByAverageVeloicty(){
    let current_pos = Number(this.position), 
        start_pos = Number(this.starting_position), 
        current_vel = Number(this.velocity), 
        time =  Number(this.time)
    return Math.round( (current_pos-start_pos-( time*current_vel/2 )) / (time/2) *1000)/1000 + '[mps]';
  }
  findTimeByAverageVelocity(){
    let current_pos = Number(this.position), 
        start_pos = Number(this.starting_position), 
        current_vel = Number(this.velocity), 
        start_vel = Number(this.starting_velocity);
    return Math.round( (2*(current_pos - start_pos))/(current_vel + start_vel) *1000)/1000 + '[s]';
  }

  /* Position by constant velocity and time  */
  findPositionByConstantVelocity(){
    let start_pos = Number(this.starting_velocity);
    let vel = Number(this.velocity);
    let t = Number(this.time);
    return Math.round(( start_pos + vel * t  ) *1000)/1000 + '[m]';
  }

  findStartingPositionByConstantVelocity(){
    let pos = Number(this.position);
    let vel = Number(this.velocity);
    let t = Number(this.time);
    return Math.round(( pos - vel * t  ) *1000)/1000 + '[m]';
  }

  findTimeByConstantVelocity(){
    let start_pos = Number(this.starting_position);
    let vel = Number(this.velocity)
    let pos = Number(this.position);
    return Math.round( ((pos - start_pos)/vel ) *1000)/1000 + '[s]';
  }

  findVelocityByConstantVelocity(){
    let start_pos = Number(this.starting_position);
    let time = Number(this.time);
    let pos = Number(this.position);

    return Math.round (( (pos-start_pos)/time ) *1000)/1000 + '[mps]';
  }

  /* Force */
  findForceByMassAndAcceleration(arr){
    let mass = Number(arr[0]), acc = Number(this.acceleration);
    return Math.round( (mass * acc) *1000)/1000 + '[N]';
  }
}
