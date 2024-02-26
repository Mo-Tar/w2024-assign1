const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();

const supaUrl = "https://wihurjejqcrieuugurvs.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaHVyamVqcWNyaWV1dWd1cnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg4ODA0MjksImV4cCI6MjAyNDQ1NjQyOX0.IaBI4ZglroiM7N0HY14FXYNgHI3PMW99rPTlrk-yKDM";

const supabase = supa.createClient(supaUrl, supaAnonKey);

//Returns all the season
app.get("/api/seasons", async (req, res) => {
  const { data, error } = await supabase.from("seasons").select();
  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  res.send(data);
});

//Returns all the circuits
app.get("/api/circuits", async (req, res) => {
  const { data, error } = await supabase.from("circuits").select();

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  res.send(data);
});

//Returns just the specified circuit based on circuitRef
app.get("/api/circuits/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("circuits")
    .select()
    .eq("circuitRef", req.params.ref);

  if (data.length === 0) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  res.send(data);
});

//Returns the circuits used in a given seasons and ordered by round in ascending order
app.get("/api/circuits/season/:year", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select(`circuits(*)`)
    .eq("year", req.params.year)
    .order("round", { ascending: true });

  if (error) {
    res.send({
      Error: `Error fetching data: ${req.params.year} does not exist within data`,
    });
    return;
  }
  res.send(data);
});

//returns all constructors
app.get("/api/constructors", async (req, res) => {
  const { data, error } = await supabase.from("constructors").select();
  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  res.send(data);
});

//Returns just the specified constructor
app.get("/api/constructors/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("constructors")
    .select()
    .eq("constructorRef", req.params.ref);

  if (error) {
    res.send({
      Error: `Error fetching data: ${req.params.year} does not exist within data`,
    });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: ${req.params.ref} is an invalid parameter or it does not exist`,
    });
    return;
  }

  res.send(data);
});

//Returns all the drivers
app.get("/api/drivers", async (req, res) => {
  const { data, error } = await supabase.from("drivers").select();

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  res.send(data);
});

//GET drivers based on reference
app.get("/api/drivers/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select()
    .eq("driverRef", req.params.ref);

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: ${req.params.ref} is an invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns the drivers whose surname (case insensitive) begins with the provided substring
app.get("/api/drivers/search/:substring", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select()
    .ilike("surname", `${req.params.substring}%`);

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns the drivers within a given race
app.get("/api/drivers/race/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select("drivers(*)")
    .eq("raceId", req.params.raceId);

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns just the specified race
app.get("/api/races/:raceid", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select(
      "raceId, year, round, circuits (name, location, country), name, date, time, url, fp1_date, fp1_time, fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time"
    )
    .eq("raceId", req.params.raceid);

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns the races within a given season ordered by round
app.get("/api/races/season/:year", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select()
    .eq("year", req.params.year)
    .order("round");
  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns a specific race within a given season specified by the round number
app.get("/api/races/season/:year/:round", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select()
    .eq("year", req.params.year)
    .eq("round", req.params.round);
  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns all the races for a given circuit
app.get("/api/races/circuits/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select("*, circuits!inner()")
    .eq("circuits.circuitRef", req.params.ref)
    .order("year");
  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns all the races for a given circuit between two years
app.get("/api/races/circuits/:ref/season/:start/:end", async (req, res) => {
  if (req.params.start > req.params.end) {
    res.send({
      Error:
        "Error fetching data: Your start date cannot be greater than your end date ",
    });
    return;
  }

  const { data, error } = await supabase
    .from("races")
    .select("*, circuits!inner()")
    .eq("circuits.circuitRef", req.params.ref)
    .gte("year", req.params.start)
    .lte("year", req.params.end);

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns the results for the specified race
app.get("/api/results/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select(
      "resultId, drivers (driverRef, code, forename, surname), races (name, round, year,date), constructors (name, constructorRef, nationality), number, grid, position, positionText, positionOrder, points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId"
    )
    .eq("raceId", req.params.raceId)
    .order("grid");

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns all the results for a given driver
app.get("/api/results/driver/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select("*, drivers!inner()")
    .eq("drivers.driverRef", req.params.ref);
  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns all the results for a given driver between two dates
app.get("/api/results/driver/:ref/seasons/:start/:end", async (req, res) => {
  if (req.params.start > req.params.end) {
    res.send({
      Error:
        "Error fetching data: Your start date cannot be greater than your end date ",
    });
    return;
  }

  const { data, error } = await supabase
    .from("results")
    .select("*, drivers!inner(), races!inner()")
    .eq("drivers.driverRef", req.params.ref)
    .gte("races.year", req.params.start)
    .lte("races.year", req.params.end);

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }

  res.send(data);
});

//Returns the qualifying results for the specified race
app.get("/api/qualifying/:raceId", async (req, res) => {
  const { data, error } = await supabase
    .from("qualifying")
    .select(
      "qualifyId, drivers (driverRef, code, forename, surname), races (name, round, year, date), constructors (name, constructorRef, nationality), number, position, q1, q2, q3"
    )
    .eq("raceId", req.params.raceId)
    .order("position", { ascending: true });

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns the current season driver standings table for the specified race, sorted by position in ascending order.
app.get("/api/standings/:raceId/drivers", async (req, res) => {
  const { data, error } = await supabase
    .from("driver_standings")
    .select(
      "driverStandingsId, raceId, drivers(driverRef, code, forename, surname), points, position, positionText, wins"
    )
    .eq("raceId", req.params.raceId)
    .order("position", { ascending: true });

  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }

  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

//Returns the current season constructors standings table for the specified race, sorted by position in ascending order.
app.get("/api/standings/:raceId/constructors", async (req, res) => {
  const { data, error } = await supabase
    .from("constructor_standings")
    .select(
      "constructorStandingsId, raceId,  constructors (name, constructorRef, nationality), points, position, positionText, wins"
    )
    .eq("raceId", req.params.raceId)
    .order("position", { ascending: true });
  if (error) {
    res.send({ Error: "Error fetching data: invalid parameter" });
    return;
  }
  if (data.length === 0) {
    res.send({
      Error: `Error fetching data: You either have a invalid parameter or it does not exist`,
    });
    return;
  }
  res.send(data);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
  console.log("http://localhost:8080/api/circuits/season/2009");
});
