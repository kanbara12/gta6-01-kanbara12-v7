// Screenshot staging: each ?shot= scene sets the job, cash, REP, jobs
// done, wanted level, timer, speed, police state and dialogue together
// from the plan's table, then puts the car or the player where the
// camera for that scene needs them. The four submitted frames differ in
// location, time of day, camera and gameplay mode on purpose: a wide
// high establishing shot, a low close beach-road chase, a night
// downtown pursuit under the helicopter, and an on-foot yard fight.

import { G, SHOTS, repForJob } from '../core/config.js';
import { setMission } from '../missions/story.js';
import { showDialogue } from './hud.js';

export function applyShot(name) {
  const s = SHOTS[name];
  if (!s) return false;
  G.shot = name;
  G.shotName = name;
  G.tod = s.tod;
  setMission(s.job - 1);
  G.cash = s.cash;
  G.rep = s.complete ? 10 : repForJob(s.job);
  G.jobsDone = s.complete ? 8 : s.job - 1;
  G.elapsed = s.timer;
  G.wanted = s.wanted;
  G.wantedLabel = s.wanted === 0 ? 'CLEAR' : s.wanted >= 3 ? 'IN SIGHT' : 'SEARCHING';
  G.targetsDown = s.targetsDown || 0;
  G.loopDone = !!s.complete;
  G.shotPolice = false; G.shotHeli = false;
  G.car.inCar = true; G.player.onFoot = false;
  G.player.group.visible = false;

  if (name === 'start') {
    G.car.x = -40; G.car.z = 0; G.car.heading = 0;
    G.car.speed = s.speedKmh / 3.6;
  } else if (name === 'play') {
    G.car.x = -30; G.car.z = 0; G.car.heading = 0;
    G.car.speed = s.speedKmh / 3.6;
    // Wanted stays 0, but four units answer and the heli works the sky,
    // the variant the plan allows for this frame.
    G.shotPolice = true; G.shotHeli = true;
    G.heliState.angle = -0.6; G.heliState.radius = 26; G.heliState.height = 24;
  } else if (name === 'chase') {
    G.car.x = 40; G.car.z = 120; G.car.heading = 0;
    G.car.speed = s.speedKmh / 3.6;
    G.heliState.angle = 0.15; G.heliState.radius = 20; G.heliState.height = 20;
    G.driftPopupUntil = G.time + 999;
  } else if (name === 'mission') {
    G.car.inCar = false; G.player.onFoot = true;
    G.player.group.visible = true;
    G.car.x = 118; G.car.z = 168; G.car.heading = 2.4; G.car.speed = 0;
    G.player.x = 138; G.player.z = 172;
    G.player.heading = Math.atan2(22, 4);
    G.shotFlash = true;
    G.flashUntil = 1e9;
  } else if (name === 'end') {
    G.car.x = -238; G.car.z = -32; G.car.heading = 0.6; G.car.speed = 0;
    G.car.inCar = false; G.player.onFoot = true;
    G.player.group.visible = true;
    G.player.x = -234; G.player.z = -27;
    G.player.heading = Math.atan2(13, -16);
  }
  G.car.group.position.set(G.car.x, 0, G.car.z);
  G.car.group.rotation.y = -G.car.heading;
  if (s.dialogue) showDialogue(s.dialogue, 999);
  return true;
}
