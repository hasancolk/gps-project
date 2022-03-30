package com.example.carProject.services;
import com.example.carProject.database.Database;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;


@Service
public class DatabaseServices {
    private Connection con = null;
    private Statement statement = null;
    private PreparedStatement preparedStatement = null;
    private PreparedStatement preparedStatement2 = null;

    public DatabaseServices() {
        String url = "jdbc:mysql://" + Database.host + ":" + Database.port + "/" + Database.dbName + "?useUnicode=true&characterEncoding=utf8";
        //"?useUnicode=true&characterEncoding=utf8"
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            System.out.println("driver bulunamadi...");
        }
        try {
            con = DriverManager.getConnection(url, Database.userName, Database.password);
            System.out.println("Baglanti başarılı");
        } catch (SQLException ex) {
            System.out.println("Baglanti Başarısız...");
            //ex.printStackTrace();
        }
    }

    public int userLogin(String userName, String password) {
        String query = "select * from users where username=? and password=?";
        try {
            preparedStatement = con.prepareStatement(query);
            preparedStatement.setString(1, userName);
            preparedStatement.setString(2, password);

            ResultSet rs = preparedStatement.executeQuery();
            while (rs.next()) {
                return rs.getInt("id");
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        return -1;
    }
    public String userLogout(int id,String loginTime,String logoutTime) {
        String query = "INSERT INTO `time` (`userid`, `logintime`, `logouttime`)" +
                "VALUES ( ?, ?, ?);";
        try {
            preparedStatement=con.prepareStatement(query);
            preparedStatement.setInt(1,id);
            preparedStatement.setString(2,loginTime);
            preparedStatement.setString(3,logoutTime);
            preparedStatement.executeUpdate();
            return id +" id li kullanıcı başarı ile çıkışş yaptı giris tarihi "+loginTime +" cikis tarihi : "+logoutTime;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "hata";
    }
    public ArrayList<Integer> getUsersCars(int id)  {
        String query="SELECT carsid FROM `userscars` WHERE userid=?";
        ArrayList<Integer> listCarId=new ArrayList<Integer>();
        try {
            preparedStatement=con.prepareStatement(query);
            preparedStatement.setInt(1,id);
            ResultSet rs=preparedStatement.executeQuery();
            while (rs.next()){
                listCarId.add(rs.getInt("carsid"));
            }
            return listCarId;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
