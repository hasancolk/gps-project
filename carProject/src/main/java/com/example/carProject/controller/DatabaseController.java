package com.example.carProject.controller;


import com.example.carProject.services.DatabaseServices;
import org.apache.catalina.User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController

public class DatabaseController {
    private final DatabaseServices databaseServices;
    public DatabaseController(DatabaseServices databaseServices){
        this.databaseServices=databaseServices;
    }
    @GetMapping("/usersLogin")
    public int userLogin(@RequestParam String userName,@RequestParam String password){
        return databaseServices.userLogin(userName,password);
    }
    @PostMapping ("/userLogout")
    public  @ResponseBody String userLogout(@RequestParam int id, @RequestParam String
            loginTime, @RequestParam String logoutTime){
        return databaseServices.userLogout(id, loginTime, logoutTime);
    }
    @GetMapping("/getUsersCars")
    public ArrayList<Integer> getUsersCars(@RequestParam int id){
        return databaseServices.getUsersCars(id);
    }
}
