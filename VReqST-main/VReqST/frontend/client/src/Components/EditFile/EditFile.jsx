import axios from "axios";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-terminal";
import { FaSave } from "react-icons/fa";
import { useHistory, useParams, Link } from "react-router-dom";

import isJson from "../../utils/checkjson";
import { check } from "express-validator";
var a = 0, b = 0, c = 0, d = 0;
const EditFile = () => {
  const [filename, setfilename] = useState("");
  const [data, setdata] = useState("");
  const [loading, setLoading] = useState(false);
  const [grammarfor, setGrammarfor] = React.useState("scene");
  const [privateFile, setPrivateFile] = useState(false);
  const [flag, setflag] = useState(false);

  const history = useHistory();
  const toast = useToast();
  let { fileid } = useParams();


  const fetchdata = async () => {
    const jwttoken = localStorage.getItem("jwtToken");
    setLoading(true);
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await axios.get(
        `http://localhost:5002/api/json/${fileid}`,
        requestOptions
      );

      setdata(res.data.data);
      setfilename(res.data.name);
      setGrammarfor(res.data.grammarfor);
      setPrivateFile(res.data.private);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  function onChange(newValue) {
    setdata(newValue);
    console.log("heleo");
  }

  const submitform = async () => {
    if (!isJson(data)) {
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const jwttoken = localStorage.getItem("jwtToken");
    setLoading(true);
    // console.log("start ");
    // console.log(data);
    // console.log(filename);
    // console.log(grammarfor);
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      console.log(privateFile);
      let url = "";
      if (grammarfor == "scene") { url = `http://localhost:5002/api/json/${fileid}/scene`; }
      if (grammarfor == "action") { url = `http://localhost:5002/api/json/${fileid}/action`; }
      if (grammarfor == "asset") { url = `http://localhost:5002/api/json/${fileid}/asset`; }
      if (grammarfor == "custom") { url = `http://localhost:5002/api/json/${fileid}/custom`; }
      if (grammarfor == "timeline") { url = `http://localhost:5002/api/json/${fileid}/timeline`; }

      await axios.patch(
        url,
        { data, name: filename, grammarfor },
        requestOptions
      );
      // history.push("/myfiles");
      setLoading(false);
      toast({
        title: "File updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
    }
    setflag(false);
  };

  return loading ? (
    <>
      <Flex
        width={"100vw"}
        height={"85vh"}
        justifyContent="center"
        alignItems={"center"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    </>
  ) : (
    <Box minH={"85vh"}>
      <Breadcrumb
        spacing="8px"
        pt={5}
        pl={5}
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/myfiles">
            My Files
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{filename}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        alignItems="center"
        py="50px"
      >
        <Flex
          boxShadow={"xl"}
          p={8}
          rounded={"xl"}
          align={"center"}
          borderWidth={"1px"}
          borderColor="gray.400"
          mb={5}
        >
          <Flex justifyContent="center" flexDir={"column"}>
            <Box p="2">
              <Input
                colorScheme="yellow"
                placeholder="File Name"
                isRequired
                onChange={(e) => setfilename(e.target.value)}
                value={filename}
              />
            </Box>
            <RadioGroup onChange={setGrammarfor} value={grammarfor} py={2}>
              <Stack direction="row">
                <Radio value="scene">Scene</Radio>
                <Radio value="asset">Asset</Radio>
                <Radio value="action">Action</Radio>
                {/* <Radio value="custom">Custom</Radio> */}
                <Radio value="timeline">Timeline</Radio>

              </Stack>
            </RadioGroup>
            <FormControl display="flex" justifyContent="center" pb={2}>
              <FormLabel htmlFor="public-file" mb="0">
                DEFAULT
              </FormLabel>
              <Switch
                id="public-file"
                defaultChecked={false}
                onChange={() => {
                  if (!flag) {
                    if (grammarfor === "scene") {
                      onChange(`{
                      "_scenename":{
                         "req":"mandatory",
                         "typeof":"string",
                         "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                      "_sid":{
                         "req":"mandatory",
                         "typeof":"string",
                         "repeat":"notallow",
                         "%comment%":"A fillable Unique Identifier of the scene"
                      },
                      "_slabel":{
                         "req":"optional",
                         "typeof":"string",
                         "repeat":"notallow",
                         "%comment%":"A fillable Optional text field for scene description in 200 words"
                      },
                     "#pid":{
                        "req":"mandatory",
                        "root":"_playarea",
                        "typeof":"string",
                        "%comment%":"pid"
                     },
                     "#length_uplayarea":{
                        "req":"mandatory",
                        "root":"_playarea",
                        "typeof":"string",
                        "repeat":"notallow",
                        "%comment%":"pid"
                     },
                     "#breadth_uplayarea":{
                        "req":"mandatory",
                        "root":"_playarea",
                        "typeof":"string",
                        "repeat":"notallow",
                        "%comment%":"pid"
                     },
                     "#height_uplayarea":{
                        "req":"mandatory",
                        "root":"_playarea",
                        "typeof":"string",
                        "repeat":"notallow",
                        "%comment%":"pid"
                     },
                     
                     "#x_scenecenter":{
                        "req":"mandatory",
                        "root":"_playarea",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"pid"
                     },
                     "#y_scenecenter":{
                        "req":"mandatory",
                        "root":"_playarea",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"pid"
                     },
                     "#z_scenecenter":{
                        "req":"mandatory",
                        "root":"_playarea",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"pid"
                     },
                     
                      
                          "IsSceneObject":{
                        "root":"_camera",
                         "req":"mandatory",
                         "typeof":"boolean",
                         "repeat":"notallow",
                         "%comment%":"true for yes, false for no. This is to set initial camera in the scene. Additional attributes include IsSceneObject which holds boolean value and trackingorigin holds string value i.e. either floor (physical real-world ground) or +/- height from the physical real-world ground. Example: 5+floor"
                      },
                        "trackingorigin":{
                        "root":"_camera",
                         "req":"mandatory",
                         "typeof":"string",
                         "repeat":"notallow",
                         "%comment%":"true for yes, false for no. This is to set initial camera in the scene. Additional attributes include IsSceneObject which holds boolean value and trackingorigin holds string value i.e. either floor (physical real-world ground) or +/- height from the physical real-world ground. Example: 5+floor"
                      },
                      "#x_initialcamerapos":{
                        "root":"_initialcamerapos",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"emo"
                      },
                      "#y_initialcamerapos":{
                        "root":"_initialcamerapos",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"emo"
                      },
                      "#z_initialcamerapos":{
                        "root":"_initialcamerapos",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"emo"
                      },
                  
                      "#x_viewport":{
                        "root":"_viewport",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"emo"
                      },
                      "#y_viewport":{
                        "root":"_viewport",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"emo"
                      },
                      "#w_viewport":{
                        "root":"_viewport",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"emo"
                      },
                      "#h_viewport":{
                        "root":"_viewport",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"emo"
                      },
                     
                     "near_cp":{
                        "root":"_clippingplane",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"Used to represent near clipping plane with value ranging from 0.0 to 1000000"
                     },
                  
                     "far_cp":{
                        "root":"_clippingplane",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"Used to represent far clipping plane with value ranging from 0.0 to 1000000"
                     },
                  
                      "_horizon":{
                         "req":"mandatory",
                         "typeof":"boolean",
                         "repeat":"notallow",
                         "%comment%":"true for yes, false for no. This is to set horizon sun to map the terrian with real world"
                      },
                      "_dof":{
                         "req":"mandatory",
                         "typeof":"number",
                         "repeat":"notallow",
                         "%comment%":"accepts two values 3 and 6. Throw errors for the rest of the values"
                      },
                      "_skybox":{
                         "req":"mandatory",
                         "typeof":"number",
                         "repeat":"notallow",
                         "%comment%":"accepts two values 3 and 6. Throw errors for the rest of the values"
                      },
                     
                     "type":{
                        "root":"_controllers",
                        "req":"mandatory",
                        "typeof":"string",
                        "repeat":"notallow",
                        "%comment%":"type"
                     },
                     "raycast":{
                        "root":"_controllers",
                        "req":"mandatory",
                        "typeof":"boolean",
                        "repeat":"notallow",
                        "%comment%":"type"
                     },
                     "raydistance":{
                        "root":"_controllers",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"type"
                     },
                     "raythinkness":{
                        "root":"_controllers",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"type"
                     },
                     "raycolor":{
                        "root":"_controllers",
                        "req":"mandatory",
                        "typeof":"string",
                        "repeat":"notallow",
                        "%comment%":"type"
                     },
                     "raytype":{
                        "root":"_controllers",
                        "req":"mandatory",
                        "typeof":"string",
                        "repeat":"notallow",
                        "%comment%":"type"
                     },
                     "value":{
                        "root":"_gravity",
                        "req":"mandatory",
                        "typeof":"number",
                        "%comment%":"value of earth gravity"
                     },
                      "_interaction":{
                         "req":"mandatory",
                         "typeof":"boolean",
                         "repeat":"notallow",
                         "%comment%":"This describes the interaction capacity in the scene."
                      },
                     "#value":{
                        "root":"_nestedscene",
                        "req":"mandatory",
                        "typeof":"boolean",
                        "repeat":"notallow",
                        "%comment%":"value"
                     },
                     "#scenecount":{
                        "root":"_nestedscene",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"value"
                     },
                     "#sid_order":{
                        "root":"_nestedscene",
                        "req":"mandatory",
                        "typeof":"number",
                        "repeat":"notallow",
                        "%comment%":"value"
                     },
                      "_audio":{
                         "req":"mandatory",
                         "typeof":"boolean",
                         "repeat":"notallow",
                         "%comment%":"true for spatial audio, false for no spatial audio"
                      },
                      "_timeline":{
                         "req":"mandatory",
                         "typeof":"boolean",
                         "repeat":"notallow",
                         "%comment%":"true for timed scene with dynamic events, false for a static scene with static events"
                      },
                      "_Opttxt1":{
                         "req":"optional",
                         "typeof":"string",
                         "repeat":"notallow",
                         "%comment%":"For user optional text"
                      },
                      "@context_mock":{
                         "req":"optional",
                         "typeof":"string",
                         "repeat":"notallow",
                         "%comment%":"For external reference URLs like figma screens or other resource links"
                      },
                       "usertype":{
                         "req":"mandatory",
                         "typeof":"object",
                         "repeat":"notallow",
                         "%comment%":"Defines the scene as Single user or Multi-user scene along with additional values like uplayarea to define the length, breadth and height of the user along with initialupos value in x,y,z coordinates"
                      },
                      "type":{
                    "root": "usertype",
                     "req":"mandatory",
                      "typeof":"string",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                   "#length_uplayarea":{
                    "root": "uplayarea",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                      "#breadth_uplayarea":{
                    "root": "uplayarea",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                      "#height_uplayarea":{
                        "root": "uplayarea",
                         "proot":"usertype", 
                         "req":"mandatory",
                          "typeof":"number",
                          "repeat":"allow",
                          "%comment%":"asdfasdf"
                          },
                      "#x_initialupos":{
                    "root": "initialupos",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                      "#y_initialupos":{
                    "root": "initialupos",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                      "#z_initialupos":{
                    "root": "initialupos",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                        "#x_uplayareacenter":{
                    "root": "uplayareacenter",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                      "#y_uplayareacenter":{
                    "root": "uplayareacenter",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      },
                      "#z_uplayareacenter":{
                    "root": "uplayareacenter",
                     "proot":"usertype", 
                     "req":"mandatory",
                      "typeof":"number",
                      "repeat":"allow",
                      "%comment%":"asdfasdf"
                      }
                   }`)
                    }
                    else if (grammarfor === "asset") {
                      onChange(`{
                      "articles": {
                          "req": "mandatory",
                          "typeof": "object",
                          "repeat": "notallow",
                          "%comment%": "ooann"
                      },
                      "_objectname": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "_sid": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "_slabel": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "_IsHidden": {
                          "req": "mandatory",
                          "typeof": "number",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "_enumcount": {
                          "req": "mandatory",
                          "typeof": "number",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "_Is3DObject": {
                          "req": "mandatory",
                          "typeof": "number",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "HasChild": {
                          "req": "mandatory",
                          "typeof": "number",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "shape": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "dradii": {
                          "req": "mandatory",
                          "typeof": "number",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "dimension",
                          "%comment%": "ooann"
                      },
                      "dvolumn": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "dimension",
                          "%comment%": "ooann"
                      },
                      "dlength": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "dimension",
                          "%comment%": "ooann"
                      },
                      "dbreadth": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "dimension",
                          "%comment%": "ooann"
                      },
                      "dheigth": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "dimension",
                          "%comment%": "ooann"
                      },
                      "IsText": {
                          "req": "mandatory",
                          "typeof": "boolean",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "IsText3D": {
                          "req": "mandatory",
                          "typeof": "boolean",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "CastShadow": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "lighting",
                          "%comment%": "ooann"
                      },
                      "ReceiveShadow": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "lighting",
                          "%comment%": "ooann"
                      },
                      "ContributeGlobalIlumination": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "lighting",
                          "%comment%": "ooann"
                      },
                      "IsIlluminate": {
                          "req": "mandatory",
                          "typeof": "boolean",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "ooann"
                      },
                      "#x_initialpos": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_initalpos",
                          "%comment%": "ooann"
                      },
                      "#y_initialpos": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_initalpos",
                          "%comment%": "ooann"
                      },
                      "#z_initialpos": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_initalpos",
                          "%comment%": "ooann"
                      },
                      "#x_initialrotation": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_initalrotation",
                          "%comment%": "ooann"
                      },
                      "#y_initialrotation": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_initalrotation",
                          "%comment%": "ooann"
                      },
                      "#z_initialrotation": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_initalrotation",
                          "%comment%": "ooann"
                      },
                      "#x_objectscale": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_objectscale",
                          "%comment%": "ooann"
                      },
                      "#y_objectscale": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_objectscale",
                          "%comment%": "ooann"
                      },
                      "#z_objectscale": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Transform_objectscale",
                          "%comment%": "ooann"
                      },
                      "#distfactorx": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "repeattransform",
                          "%comment%": "ooann"
                      },
                      "#distfactory": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "repeattransform",
                          "%comment%": "ooann"
                      },
                      "#distfactorz": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "repeattransform",
                          "%comment%": "ooann"
                      },
                  
                      "XRGrabInteractable": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "XRInteractionMaskLayer": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "TrackPosition": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "TrackRotation": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "Throw_Detach": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "forcegravity": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "velocity": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "angularvelocity": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "proot": "articles",
                          "root": "Interaction",
                          "%comment%": "ooann"
                      },
                      "Smoothing": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "uuhjefbj"
                      },
                      "Smoothing_duration": {
                          "req": "mandatory",
                          "typeof": "string",
                          "repeat": "allow",
                          "root": "articles",
                          "%comment%": "uuhjefbj"
                      },
                      "#rotate_x": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "attachtransform",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "#rotate_y": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "attachtransform",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "#rotate_z": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "attachtransform",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "#pos_x": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "attachtransform",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "#pos_y": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "attachtransform",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "#pos_z": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "attachtransform",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "value": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "mass": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "dragfriction": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "angulardrag": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "Isgravityenable": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "IsKinematic": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "CanInterpolate": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "CollisionPolling": {
                          "req": "mandatory",
                          "typeof": "string",
                          "proot": "articles",
                          "root": "XRRigidObject",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_hasaudio": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_type": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_src": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_volume": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_PlayInloop": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_IsSurround": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_Dopplerlevel": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_spread": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_mindist": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "aud_maxdist": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "_Opttxt1": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      },
                      "@context_img_source": {
                          "req": "mandatory",
                          "typeof": "string",
                          "root": "articles",
                          "repeat": "allow",
                          "%comment%": "gehdwib"
                      }
                  }`)
                    }
                    else if (grammarfor === "action") {
                      onChange(`{

                      "ObjAction":{
                          "req":"mandatory",
                          "typeof":"object",
                           "repeat":"notallow",
                           "%comment%":"Mention your VR Scene name here"
                          },
                        
                      "actresid":{
                          "req":"mandatory",
                           "root":"ObjAction",
                          "typeof":"string",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          },	
                        
                      "sourceObj":{
                          "req":"mandatory",
                        "root":"ObjAction",
                          "typeof":"string",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          },	
                      
                      "targetObj":{
                          "req":"mandatory",
                        "root":"ObjAction",
                          "typeof":"string",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          },	
                      
                      
                      "IsCollision":{
                          "req":"mandatory",
                        "root":"ObjAction",
                          "typeof":"boolean",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          },	
                      
                      "response":{
                          "req":"mandatory",
                        "root":"ObjAction",
                          "typeof":"string",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          },		
                        
                        "comment":{
                          "req":"mandatory",
                          "root":"ObjAction",
                          "typeof":"string",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          },
                      
                      "Syncronous":{
                          "req":"mandatory",
                        "root":"ObjAction",
                          "typeof":"boolean",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          },
                        
                        "repeatactionfor":{
                          "req":"mandatory",
                          "root":"ObjAction",
                          "typeof":"string",
                           "repeat":"allow",
                           "%comment%":"Mention your VR Scene name here"
                          }
                      
                      
                      
                      }	
                        `)
                    }
                    else if (grammarfor === "timeline") {
                      onChange(`{
                      "tsyncid":{
                        "root": "animate_trigSync",
                         "req":"mandatory",
                         "typeof":"number",
                         "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "tsOntrigger":{
                        "root": "animate_trigSync",
                         "req":"optional",
                         "typeof":"boolean",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                      "SyncObjList":{
                        "root": "animate_trigSync",
                         "req":"optional",
                         "typeof":"object",
                         "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "tSyncNote":{
                        "root": "animate_trigSync",
                         "req":"optional",
                         "typeof":"string",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     
                       "ntsyncid":{
                        "root": "animate_nontrigSync",
                         "req":"mandatory",
                         "typeof":"number",
                          "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "ntsOntrigger":{
                        "root": "animate_nontrigSync",
                         "req":"optional",
                         "typeof":"boolean",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                      "ntSyncObjList":{
                        "root": "animate_nontrigSync",
                         "req":"optional",
                         "typeof":"object",
                         "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "ntSyncNote":{
                        "root": "animate_nontrigSync",
                         "req":"optional",
                         "typeof":"string",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     
                     
                    
                        "tasyncid":{
                        "root": "animate_trigAsync",
                         "req":"mandatory",
                         "typeof":"number",
                           "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "taOntrigger":{
                        "root": "animate_trigAsync",
                         "req":"optional",
                         "typeof":"boolean",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                      "AsyncObjList":{
                        "root": "animate_trigAsync",
                         "req":"optional",
                         "typeof":"object",
                         "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "tAsyncNote":{
                        "root": "animate_trigAsync",
                         "req":"optional",
                         "typeof":"string",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     
                       "ntasyncid":{
                        "root": "animate_nontrigAsync",
                         "req":"mandatory",
                         "typeof":"number",
                          "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "ntaOntrigger":{
                        "root": "animate_nontrigAsync",
                         "req":"optional",
                         "typeof":"boolean",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                      "ntAsyncObjList":{
                        "root": "animate_nontrigAsync",
                         "req":"optional",
                         "typeof":"object",
                         "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                     "ntAsyncNote":{
                        "root": "animate_nontrigAsync",
                         "req":"optional",
                         "typeof":"string",
                        "repeat":"notallow",
                         "%comment%":"Mention your VR Scene name here"
                      },
                      
                      "routine":{
                         "repeat":"notallow",
                         "req":"mandatory",
                        "typeof":"object",
                          "%comment%":"Mention your VR Scene name here"
                      },
                      
                     
                     "routeid":{
                       "root": "routine",
                       "req":"mandatory",
                       "typeof":"number",
                        "repeat":"allow",
                        "%comment%":"Mention your VR Scene name here"
                       
                     },
                      "starttime":{
                       "root": "routine",
                       "req":"optional",
                       "typeof":"string",
                         "repeat":"allow",
                        "%comment%":"Mention your VR Scene name here"
                       
                     },
                      "endtime":{
                       "root": "routine",
                       "req":"optional",
                       "typeof":"string",
                         "repeat":"allow",
                        "%comment%":"Mention your VR Scene name here"
                       
                     },
                       "order":{
                       "root": "routine",
                       "req":"optional",
                       "typeof":"object",
                          "repeat":"allow",
                        "%comment%":"Mention your VR Scene name here"
                       
                     }
                     
                     
                   }`)
                    }

                    setflag(true)
                  }
                  else {
                    onChange(" ");
                    setflag(false)
                  }


                  //   editor.setOptions({
                  //     readOnly: true,
                  //     highlightActiveLine: false,
                  //     highlightGutterLine: false
                  // })
                }}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Box mx={"40px"}>
          <AceEditor
            fontSize={16}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            mode="json"
            theme="terminal"
            onChange={onChange}
            value={data}
            name="grammar-editor"
            id="grammar-editor"
            wrapEnabled
            height="40em"
            width="60em"
          />
        </Box>
        <Center minW="max-content" justifyContent={"center"} my={"20px"}>
          <Button
            leftIcon={<FaSave />}
            colorScheme="yellow"
            disabled={!filename || !data}
            onClick={() => {
              submitform()
              if (grammarfor == "scene") { a = 1 };
              if (grammarfor == "asset") { b = 1 };
              if (grammarfor == "action") { c = 1 };
              if (grammarfor == "timeline") { d = 1 };

            }}
            isLoading={loading}
          >
            Save File
          </Button>
          <Button
            leftIcon={<FaSave />}
            colorScheme="yellow"
            disabled={!(a & b & c & d)}
            onClick={() => {
              history.push("/myfiles");

            }}
            isLoading={loading}
          >
            submit
          </Button>
        </Center>
      </Flex>
    </Box>
  );
};

export default EditFile;
